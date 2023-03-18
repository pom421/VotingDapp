import { useState, useEffect } from "react"
import { useEth } from "./EthContext"

const eventName = "WorkflowStatusChange"

const getStatus = async (connectedUser, contract) => {
  if (connectedUser && contract) {
    const status = await contract.methods.workflowStatus().call({ from: connectedUser })
    return status
  }
}

export function useEventWorkflowStatus() {
  const {
    state: { contract, web3, connectedUser },
  } = useEth()

  const [status, setStatus] = useState()
  const [subscriptionId, setSubscriptionId] = useState()

  useEffect(() => {
    async function run() {
      // Initial status value.
      setStatus(await getStatus(connectedUser, contract))

      // Listen to new status.
      const currentBlock = await web3.eth.getBlockNumber()
      const listener = await contract.events[eventName]({ fromBlock: currentBlock })

      listener
        .on("connected", (subscriptionId) => setSubscriptionId(subscriptionId))
        .on("data", (event) => {
          console.debug("Status change", event)
          setStatus(event.returnValues.newStatus)
        })
        .on("error", (err) => console.error("Error on listening event WorkflowStatusChange", err))

      return () => {
        console.debug("unsubscribe listener for status event")
        listener.unsubscribe(subscriptionId)
      }
    }

    if (contract) run()
  }, [contract]) // Run effect every time contract changes.

  return status
}
