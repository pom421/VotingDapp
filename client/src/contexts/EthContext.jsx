import React, { useReducer, useCallback, useEffect } from "react"
import Web3 from "web3"
import { ALL_STATUS, NETWORKS } from "../utils/constants"
import { useContext } from "react"
import { createContext } from "react"

export const EthContext = createContext()
EthContext.displayName = "EthContext"

const actions = {
  init: "INIT",
}

const initialState = {
  artifact: null,
  web3: null,
  userAdress: null,
  networkName: null,
  networkID: null,
  contract: null,
  transactionHash: null,
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

const getStatus = async (account, contract) => {
  if (account && contract) {
    const status = await contract.methods.workflowStatus().call({ from: account })
    return ALL_STATUS[status]
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
      const { abi } = artifact
      let contractAddress, transactionHash, contract, workflowStatus
      try {
        contractAddress = artifact.networks[networkID].address
        transactionHash = artifact.networks[networkID].transactionHash
        contract = new web3.eth.Contract(abi, contractAddress)
        workflowStatus = await getStatus(connectedUser, contract)
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
          networkID,
          networkName,
          transactionHash,
          workflowStatus,
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
      console.log("la chain ou l'account a changé")
      init(state.artifact)
    }

    events.forEach((e) => window.ethereum.on(e, handleChange))
    return () => {
      events.forEach((e) => window.ethereum.removeListener(e, handleChange))
    }
  }, [init, state.artifact])

  useEffect(() => {
    async function run() {
      const currentBlock = await state.web3.eth.getBlockNumber()
      const listener = await state.contract.events.WorkflowStatusChange({ fromBlock: currentBlock })

      listener
        .on("data", (event) => {
          console.log("Changement de status", event)
          dispatch({
            type: actions.init,
            data: { workflowStatus: ALL_STATUS[event.returnValues.newStatus] },
          })
        })
        .on("error", (err) => console.error("Error on listening event WorkflowStatusChange", err))
    }

    if (state.web3 && state.contract) {
      run()
    }
  }, [state.web3, state.contract])

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
