import { useState, useEffect } from "react"
import { useEth } from "./EthContext"

const eventName = "VoterRegistered"

export function useEventVoter() {
  const {
    state: { contract, transactionHash, web3 },
  } = useEth()

  const [voters, setVoters] = useState([])

  async function getPastEvent() {
    const deployTransaction = await web3.eth.getTransaction(transactionHash)
    const events = await contract.getPastEvents(eventName, {
      fromBlock: deployTransaction.blockNumber,
      toBlock: "latest",
    })

    const voters = events.map((event) => ({ voterAddress: event.returnValues.voterAddress }))
    setVoters(voters)
  }

  async function getNewEvent() {
    const currentBlock = await web3.eth.getBlockNumber()

    const listener = await contract.events[eventName]({
      fromBlock: currentBlock,
    })

    listener.on("data", (event) => {
      console.debug("Ajout de votant", event)
      setVoters((voters) => [...voters, { voterAddress: event.returnValues.voterAddress }])
    })

    return () => listener.unsubscribe()
  }

  useEffect(() => {
    if (contract) {
      // Load with past events of VoterRegistered.
      getPastEvent()
      // Load with new events of VoterRegistered.
      const unsubscribe = getNewEvent()

      return () => unsubscribe()
    }
  }, [contract])

  return { voters }
}
