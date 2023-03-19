import { useCallback, useEffect, useState } from "react"
import { useEth } from "../contexts/EthContext"
import { VotingContractService } from "../services/VotingContractService"

/**
 * Hook for getting the voters from the contract and a function to manually refresh the voters.
 */
export const useGetVoters = () => {
  const {
    state: { connectedUser, contract },
  } = useEth()
  const [voters, setVoters] = useState([])

  // Get voters from past events and update the state.
  const refreshVoters = useCallback(
    async function run() {
      const voters = await VotingContractService.getInstance({ contract, connectedUser }).getVotersFromPastEvents()
      setVoters(voters)
    },

    [contract, connectedUser],
  )

  // Fetch proposals when the contract changes.
  useEffect(() => {
    if (contract && connectedUser) refreshVoters()
  }, [contract, connectedUser])

  return { voters, refreshVoters }
}
