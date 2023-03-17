import { useState, useEffect } from "react"
import { useEth } from "./EthContext"

const eventName = "VoterRegistered"

const getVoters = async ({ contract, fromBlock, toBlock }) => {
  const events = await contract.getPastEvents(eventName, {
    fromBlock,
    toBlock,
    // toBlock: "latest",
  })

  return events.map((event) => ({ voterAddress: event.returnValues.voterAddress }))
}

export function useEventVoter() {
  const {
    state: { contract, deployTransaction, web3 },
  } = useEth()

  const [voters, setVoters] = useState([])
  const [subscriptionId, setSubscriptionId] = useState()

  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    async function run() {
      setIsLoaded(true)
      const currentBlock = await web3.eth.getBlockNumber()

      // Load with past events of VoterRegistered.
      setVoters(await getVoters({ contract, fromBlock: deployTransaction.blockNumber, toBlock: currentBlock - 1 }))

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
          setVoters((voters) => [...voters, { voterAddress: event.returnValues.voterAddress }])
        })

      return () => {
        console.debug("unsubscribe listener for add voter event")
        listener.unsubscribe(subscriptionId)
      }
    }

    if (contract && !isLoaded) run()
  }, [contract])

  return { voters }
}
