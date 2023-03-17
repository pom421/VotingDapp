import { useState, useEffect } from "react"
import { useEth } from "./EthContext"
import uniqBy from "lodash/uniqBy"

const eventName = "VoterRegistered"

const getVoters = async ({ contract, fromBlock }) => {
  const events = await contract.getPastEvents(eventName, {
    fromBlock,
    toBlock: "latest",
  })

  return events.map((event) => ({ voterAddress: event.returnValues.voterAddress }))
}

export function useEventVoter() {
  const {
    state: { contract, deployTransaction, web3 },
  } = useEth()

  const [voters, setVoters] = useState([])
  const [subscriptionId, setSubscriptionId] = useState()

  useEffect(() => {
    async function run() {
      const currentBlock = await web3.eth.getBlockNumber()

      // Load with past events of VoterRegistered.
      const initialVoters = await getVoters({
        contract,
        fromBlock: deployTransaction.blockNumber,
      })

      // Load with new events of VoterRegistered.
      const listener = await contract.events[eventName]({
        fromBlock: currentBlock,
      })

      listener
        .on("connected", (subscriptionId) => {
          console.log("connected", subscriptionId)
          setSubscriptionId(subscriptionId)
        })
        .on("data", (event) => {
          console.debug("Ajout de votant", event)
          const uniqueVoters = uniqBy(
            [...initialVoters, { voterAddress: event.returnValues.voterAddress }],
            (element) => element.voterAddress,
          )

          setVoters(uniqueVoters)
        })

      return () => {
        console.debug("unsubscribe listener for add voter event")
        listener.unsubscribe(subscriptionId)
      }
    }

    if (contract) run()
  }, [contract])

  return { voters }
}
