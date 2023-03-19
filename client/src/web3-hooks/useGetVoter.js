import { useCallback, useEffect, useState } from "react"
import { useEth } from "../contexts/EthContext"
import { VotingContractService } from "../services/VotingContractService"

/**
 * Hook for getting the current user as a voter from the contract and a function to manually refresh him.
 */
export const useGetVoter = () => {
  const {
    state: { connectedUser, contract },
  } = useEth()
  const [currentVoter, setCurrentVoter] = useState()

  const refreshCurrentVoter = useCallback(
    async function run() {
      const voter = await VotingContractService.getInstance({ contract, connectedUser }).getVoter(connectedUser)
      setCurrentVoter(voter)
    },
    [contract, connectedUser],
  )

  // Fetch proposals when the contract changes.
  useEffect(() => {
    if (contract && connectedUser) {
      refreshCurrentVoter()
    }
  }, [contract, connectedUser])

  return { currentVoter, refreshCurrentVoter }
}
