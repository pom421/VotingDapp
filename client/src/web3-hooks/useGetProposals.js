import { useCallback, useEffect, useState } from "react"
import { useEth } from "../contexts/EthContext"
import { VotingContractService } from "../services/VotingContractService"

/**
 * Hook for getting the proposals from the contract and a function to manually refresh them.
 */
export const useGetProposals = () => {
  const {
    state: { connectedUser, contract },
  } = useEth()
  const [proposals, setProposals] = useState([])

  // Get proposals from past events and update the state.
  const refreshProposals = useCallback(
    async function run() {
      const proposals = await VotingContractService.getInstance({
        contract,
        connectedUser,
      }).getProposalsFromPastEvents()
      setProposals(proposals)
    },

    [contract, connectedUser],
  )

  // Fetch proposals when the contract changes.
  useEffect(() => {
    if (contract && connectedUser) refreshProposals()
  }, [contract, connectedUser])

  return { proposals, refreshProposals }
}
