import { useEffect, useState } from "react"
import { VotingContractService } from "../services/VotingContractService"
import { useEth } from "./EthContext"

export function useEventWorkflowStatus() {
  const {
    state: { contract, connectedUser },
  } = useEth()

  const [status, setStatus] = useState()

  useEffect(() => {
    async function run() {
      const status = await VotingContractService.getInstance({ contract, connectedUser }).getWorkflowStatus()
      setStatus(status)
    }

    if (contract) run()
  }, [contract])

  return status
}
