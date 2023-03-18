import { useState, useEffect } from "react"
import { useEth } from "./EthContext"
import uniqBy from "lodash/uniqBy"

const eventName = "ProposalRegistered"

const fetchDescriptionProposal = async ({ contract, connectedUser, proposalId }) => {
  const proposalData = await contract.methods.getOneProposal(proposalId).call({ from: connectedUser })
  console.log("proposalData", proposalData)
  return { proposalId, description: proposalData.description }
}

export const getAllProposals = async ({ contract, from, connectedUser }) => {
  const proposals = await getProposalsFromEvent({ contract, from })

  return await Promise.all(
    proposals.map(
      async (proposal) => await fetchDescriptionProposal({ contract, connectedUser, proposalId: proposal.proposalId }),
    ),
  )
}

export const getProposalsFromEvent = async ({ contract, fromBlock }) => {
  const events = await contract.getPastEvents(eventName, {
    fromBlock: "earliest",
    toBlock: "latest",
  })

  return events.map((event) => ({ proposalId: event.returnValues.proposalId }))
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
          console.log("connected", subscriptionId)
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