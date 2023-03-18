import uniqBy from "lodash/uniqBy"
import { useEffect, useState } from "react"
import { VotingContractService } from "../services/VotingContractService"
import { useEth } from "./EthContext"

const eventName = "ProposalRegistered"

const fetchDescriptionProposal = async ({ contract, connectedUser, proposalId }) => {
  const proposalData = await VotingContractService.getInstance({ contract, connectedUser }).getOneProposal(proposalId)
  return { proposalId, description: proposalData.description }
}

export const getProposalsFromEvent = async ({ contract }) => {
  const events = await contract.getPastEvents(eventName, {
    fromBlock: "earliest",
    toBlock: "latest",
  })

  return events.map((event) => ({ proposalId: event.returnValues.proposalId }))
}

export const getAllProposals = async ({ contract, connectedUser }) => {
  const events = await VotingContractService.getInstance({ contract, connectedUser }).getPastEvents(eventName)

  return await Promise.all(
    events
      .map((event) => event.returnValues.proposalId)
      .map(async (proposalId) => await fetchDescriptionProposal({ contract, connectedUser, proposalId })),
  )
}

export function useEventProposal() {
  const {
    state: { contract, deployTransaction, web3 },
  } = useEth()

  const [proposals, setProposals] = useState([])
  const [subscriptionId, setSubscriptionId] = useState()

  useEffect(() => {
    async function run() {
      const currentBlock = await web3.eth.getBlockNumber()

      // Load with past events of ProposalRegistered.
      const initialProposals = await getProposalsFromEvent({
        contract,
        fromBlock: deployTransaction.blockNumber,
      })

      // Load with new events of ProposalRegistered.
      const listener = await contract.events[eventName]({
        fromBlock: currentBlock,
      })

      listener
        .on("connected", (subscriptionId) => {
          setSubscriptionId(subscriptionId)
        })
        .on("data", (event) => {
          console.debug("Ajout de proposal", event)
          const uniqueProposals = uniqBy(
            [...initialProposals, { proposalId: event.returnValues.proposalId }],
            (element) => element.proposalId,
          )

          setProposals(uniqueProposals)
        })

      return () => {
        console.debug("unsubscribe listener for add proposal event")
        listener.unsubscribe(subscriptionId)
      }
    }

    if (contract) run()
  }, [contract])

  return { proposals }
}
