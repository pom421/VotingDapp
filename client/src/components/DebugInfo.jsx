import { useEffect, useState } from "react"
import { useEth } from "../contexts/EthContext"

const getETHBalance = async (account, web3) => {
  if (account && web3) {
    const balance = await web3.eth.getBalance(account)
    console.log("balance", balance)
    return balance
  }
}

export const DebugInfo = () => {
  const {
    state: { networkName, networkID, accounts, web3 },
  } = useEth()

  const [ETHbalance, setETHBalance] = useState(0)

  useEffect(() => {
    const runAsync = async () => {
      setETHBalance(await getETHBalance(accounts?.[0], web3))
    }
    runAsync()
  }, [accounts?.[0]])

  return (
    <div style={{ border: "1px solid grey", padding: 10, borderRadius: 5 }}>
      <h1>Debug info</h1>

      <p>
        <strong>Réseau</strong> {networkID} ({networkName})
      </p>
      <p>
        <strong>Utilisateur</strong> {accounts?.[0]}
      </p>
      <p>
        <strong>ETH Balance</strong> {ETHbalance} ETH
      </p>
    </div>
  )
}
