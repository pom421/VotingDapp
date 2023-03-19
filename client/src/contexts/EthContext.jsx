import React, { createContext, useCallback, useContext, useEffect, useReducer } from "react"
import Web3 from "web3"
import { NETWORKS } from "../utils/constants"

export const EthContext = createContext()
EthContext.displayName = "EthContext"

const actions = {
  init: "INIT",
}

const initialState = {
  artifact: null,
  contract: null,
  connectedUser: null,
  deployTransaction: null,
  networkName: null,
  networkID: null,
  owner: null,
  transactionHash: null,
  userAdress: null,
  web3: null,
  workflowStatus: null,
}

const reducer = (state, action) => {
  const { type, data } = action
  switch (type) {
    case actions.init:
      return { ...state, ...data }
    default:
      throw new Error("Undefined reducer action type")
  }
}

export { actions, initialState, reducer }

const getOwner = async (account, contract) => {
  if (account && contract) {
    return await contract.methods.owner().call({ from: account })
  }
}

export function EthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  const init = useCallback(async (artifact) => {
    if (artifact) {
      const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545")
      const accounts = await web3.eth.requestAccounts()
      const connectedUser = accounts[0]
      const networkID = await web3.eth.net.getId()
      const networkName = NETWORKS[networkID] || "Réseau inconnu"
      const contractAddress = artifact.networks[networkID].address
      const transactionHash = artifact.networks[networkID].transactionHash

      const { abi } = artifact

      let contract, owner, deployTransaction
      try {
        contract = new web3.eth.Contract(abi, contractAddress)
        deployTransaction = await web3.eth.getTransaction(transactionHash)
        owner = await getOwner(connectedUser, contract)
      } catch (err) {
        console.error(err)
      }

      dispatch({
        type: actions.init,
        data: {
          artifact,
          connectedUser,
          contract,
          contractAddress,
          deployTransaction,
          networkID,
          networkName,
          owner,
          transactionHash,
          web3,
        },
      })
    }
  }, [])

  useEffect(() => {
    const tryInit = async () => {
      try {
        // eslint-disable-next-line no-undef
        const artifact = require("../contracts/Voting.json")
        init(artifact)
      } catch (err) {
        console.error(err)
      }
    }

    tryInit()
  }, [init])

  useEffect(() => {
    const events = ["chainChanged", "accountsChanged"]
    const handleChange = () => {
      console.debug("la chain ou l'account a changé")
      init(state.artifact)
    }

    events.forEach((e) => window.ethereum.on(e, handleChange))
    return () => {
      events.forEach((e) => window.ethereum.removeListener(e, handleChange))
    }
  }, [init, state.artifact])

  return (
    <EthContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      {children}
    </EthContext.Provider>
  )
}

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
export const useEth = () => {
  const values = useContext(EthContext)
  if (!values) throw new Error("A EthContext provider must be used")

  return values
}
