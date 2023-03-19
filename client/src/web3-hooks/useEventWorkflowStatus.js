import { useCallback, useEffect, useState } from "react"
import { VotingContractService } from "../services/VotingContractService"
import { useEth } from "../contexts/EthContext"

/**
 * Hook for getting the current statusfrom the contract and a function to manually refresh it.
 */
export function useWorkflowStatus() {
  const {
    state: { contract, connectedUser },
  } = useEth()

  const [workflowStatus, setWorkflowStatus] = useState()

  const refreshWorkflowStatus = useCallback(
    async function run() {
      const workflowStatus = await VotingContractService.getInstance({ contract, connectedUser }).getWorkflowStatus()
      setWorkflowStatus(workflowStatus)
    },
    [contract, connectedUser],
  )

  useEffect(() => {
    if (contract && connectedUser) {
      refreshWorkflowStatus()
    }
  }, [contract, connectedUser])

  return { workflowStatus, refreshWorkflowStatus }
}
