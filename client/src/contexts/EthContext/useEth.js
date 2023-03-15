import { useContext } from "react"
import EthContext from "./EthProvider"

// const useEth = () => useContext(EthContext)

/**
 * @typedef {Object} EthContext
 * @property {function} web3 - The web3 instance
 * @property {string} userAdress - The address of the connected user
 * @property {string} networkName - The name of the chainId
 * @property {number} networkID - The chainId
 * @property {any} contract - The smart contract instance
 */

/**
 * Custom hook to consume the EthContext.
 *
 * @returns { EthContext }
 *        The EthContext value
 */
const useEth = () => {
  const values = useContext(EthContext)
  if (!values) throw new Error("A EthContext provider must be used")

  console.log("useEth: ", JSON.stringify(values, null, 2))

  return values
}

export default useEth
