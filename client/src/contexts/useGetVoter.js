import { useEffect, useState } from "react"
import { VotingContractService } from "../services/VotingContractService"
import { useEth } from "./EthContext"

export const useConnectedUserIsVoter = () => {
  const {
    state: { contract, connectedUser },
  } = useEth()

  const [currentUserIsVoter, setCurrentUserIsVoter] = useState(false)

  useEffect(() => {
    async function run() {
      const isVoter = await VotingContractService.getInstance({ contract, connectedUser }).isVoter(connectedUser)
      setCurrentUserIsVoter(isVoter)
    }

    if (contract && connectedUser) run()
  }, [contract, connectedUser])

  return currentUserIsVoter
}
