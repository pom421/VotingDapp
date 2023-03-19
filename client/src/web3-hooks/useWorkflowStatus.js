import { useEffect, useState } from "react"
import { useEth } from "../contexts/EthContext"
import { VotingContractService } from "../services/VotingContractService"

export function useWorkflowStatus() {
  const {
    state: { contract, web3, connectedUser },
  } = useEth()

  const [workflowStatus, setWorkflowStatus] = useState()
  const [subscriptionId, setSubscriptionId] = useState()

  useEffect(() => {
    async function run() {
      // Initial status value.
      const status = await VotingContractService.getInstance({ contract, connectedUser }).getWorkflowStatus()
      setWorkflowStatus(status)

      // Listen to new status.
      const currentBlock = await web3.eth.getBlockNumber()
      const listener = await contract.events.WorkflowStatusChange({ fromBlock: currentBlock })

      listener
        .on("connected", (subscriptionId) => setSubscriptionId(subscriptionId))
        .on("data", (event) => {
          console.debug("Status change", event)
          setWorkflowStatus(event.returnValues.newStatus)
        })
        .on("error", (err) => console.error("Error on listening event WorkflowStatusChange", err))

      return () => {
        console.debug("unsubscribe listener for status event")
        listener.unsubscribe(subscriptionId)
      }
    }

    if (contract) run()
  }, [contract])

  return { workflowStatus }
}
