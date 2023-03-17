import { useState, useEffect } from "react"
import { useEth } from "./EthContext"

const eventName = "VoterRegistered"

const getVoters = async (contract, fromBlock) => {
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
      // Load with past events of VoterRegistered.
      setVoters(await getVoters(contract, deployTransaction.blockNumber))

      // Load with new events of VoterRegistered.
      const listener = await contract.events[eventName]({
        fromBlock: await web3.eth.getBlockNumber(),
      })

      listener
        .on("connected", (subscriptionId) => setSubscriptionId(subscriptionId))
        .on("data", (event) => {
          console.debug("Ajout de votant", event)
          setVoters((voters) => [...voters, { voterAddress: event.returnValues.voterAddress }])
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
