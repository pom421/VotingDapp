import { useEffect, useState } from "react"
import { VotingContractService } from "../services/VotingContractService"
import { useEth } from "../contexts/EthContext"

export const useConnectedUserIsVoter = () => {
  const {
    state: { contract, connectedUser },
  } = useEth()

  const [currentUserIsVoter, setCurrentUserIsVoter] = useState(false)

  console.log("connectedUser xxx", connectedUser)
  console.log("contract xxx", contract)

  useEffect(() => {
    async function run() {
      console.log("avant isVoter xxx")
      const isVoter = await VotingContractService.getInstance({ contract, connectedUser }).isVoter(connectedUser)
      console.log("isVoter xxx", isVoter)
      setCurrentUserIsVoter(isVoter)
    }

    run()
  }, [contract, connectedUser])

  return currentUserIsVoter
}
