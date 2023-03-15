import { useEffect, useState } from "react"
import { useEth } from "../contexts/EthContext"
import { ALL_STATUS } from "../utils/constants"

const getETHBalance = async (account, web3) => {
  if (account && web3) {
    const balance = await web3.eth.getBalance(account)
    console.log("balance", balance)
    return balance
  }
}

const getStatus = async (account, contract) => {
  if (account && contract) {
    const status = await contract.methods.workflowStatus().call({ from: account })
    return ALL_STATUS[status]
  }
}

export const DebugInfo = () => {
  const {
    state: { contract, networkName, networkID, userAddress, web3 },
  } = useEth()

  const [ETHbalance, setETHBalance] = useState(0)
  const [status, setStatus] = useState("")

  useEffect(() => {
    const runAsync = async () => {
      setETHBalance(await getETHBalance(userAddress, web3))
      setStatus(await getStatus(userAddress, contract))
    }
    runAsync()
  }, [userAddress])

  return (
    <div style={{ border: "1px solid grey", padding: 10, borderRadius: 5 }}>
      <h1>Debug info</h1>

      <p>
        <strong>Réseau</strong> {networkID} ({networkName})
      </p>
      <p>
        <strong>Utilisateur</strong> {userAddress}
      </p>
      <p>
        <strong>ETH Balance</strong> {ETHbalance} ETH
      </p>
      <p>
        <strong>Statut vote</strong> {status}
      </p>
    </div>
  )
}
