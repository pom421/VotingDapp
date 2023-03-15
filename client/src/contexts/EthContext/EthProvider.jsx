import React, { useReducer, useCallback, useEffect } from "react"
import Web3 from "web3"
import { NETWORKS } from "../../utils/constants"

import { createContext } from "react"

const EthContext = createContext()

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

function EthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  console.log("state", state)

  const init = useCallback(async (artifact) => {
    if (artifact) {
      const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545")
      const accounts = await web3.eth.requestAccounts()
      const networkID = await web3.eth.net.getId()
      const networkName = NETWORKS[networkID] || "Réseau inconnu"
      const { abi } = artifact
      let address, contract
      try {
        address = artifact.networks[networkID].address
        contract = new web3.eth.Contract(abi, address)
      } catch (err) {
        console.error(err)
      }
      dispatch({
        type: actions.init,
        data: { artifact, web3, userAddress: accounts[0], networkID, networkName, contract },
      })
    }
  }, [])

  useEffect(() => {
    const tryInit = async () => {
      try {
        // eslint-disable-next-line no-undef
        const artifact = require("../../contracts/Voting.json")
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

export default EthProvider
