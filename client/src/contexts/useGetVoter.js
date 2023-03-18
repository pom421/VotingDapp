import { useEffect, useState } from "react"
import { useEth } from "./EthContext"

export const isConnectedUserAVoter = async ({ connectedUser, contract }) => {
  if (connectedUser && contract) {
    try {
      const voter = await contract.methods.getVoter(connectedUser).call({ from: connectedUser })

      return voter.isRegistered
    } catch (error) {
      console.error("une erreur", error)
      return false
    }
  }

  console.debug("No connected user or contract, so we can't know if the user is a voter.")
}

export const useIsConnectedUserAVoter = () => {
  const {
    state: { contract, connectedUser },
  } = useEth()

  const [isVoter, setIsVoter] = useState(false)

  useEffect(() => {
    async function run() {
      setIsVoter(await isConnectedUserAVoter({ connectedUser, contract }))
    }

    if (contract) run()
  }, [contract])

  return isVoter
}
