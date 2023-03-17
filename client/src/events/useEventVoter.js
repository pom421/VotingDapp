import { useEffect, useState } from "react"
import { useEth } from "../contexts/EthContext"

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

  useEffect(() => {
    async function run() {
      // Load with past events of VoterRegistered.
      const pastVoters = await getVoters(contract, deployTransaction.blockNumber)
      console.log("past voters", pastVoters)
      setVoters(pastVoters)
    }

    if (contract) run()
  }, [contract])

  useEffect(() => {
    async function run() {
      // Load with new events of VoterRegistered.
      const listener = await contract.events[eventName]({
        fromBlock: await web3.eth.getBlockNumber(),
      })

      let subscriptionId

      listener
        .on("connected", (_subscriptionId) => {
          console.log("connected to event", _subscriptionId)
          subscriptionId = _subscriptionId
        })
        .on("data", (event) => {
          console.debug("Ajout de votant", event.returnValues.voterAddress)
          setVoters((voters) => [...voters, { voterAddress: event.returnValues.voterAddress }])
        })

      return () => {
        console.debug("unsubscribe listener for add voter event")
        listener.unsubscribe(subscriptionId)
      }
    }

    if (contract) {
      const unsubscribe = run()

      if (unsubscribe) {
        return () => {
          console.debug("unsubscribe listener for add voter event")
          unsubscribe.then((fun) => fun())
        }
      }
    }
  }, [contract])

  return { voters }
}
