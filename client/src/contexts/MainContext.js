import { createContext, useContext, useState } from "react"
import { defaultPage } from "../components/MainContent"

const MainContext = createContext()
MainContext.displayName = "MainContext"

export const MainContextProvider = (props) => {
  const [step, setStep] = useState(defaultPage)

  const contextValue = {
    step,
    setStep,
  }

  return <MainContext.Provider value={contextValue} {...props} />
}

/**
 * @typedef {Object} MainContextValue
 * @property {string} step - The step index (Object.keys(PageIndex))
 * @property {function} setStep - The step's mutator
 */

/**
 * Custom hook to consume the MainContext.
 *
 * @returns { MainContextValue }
 *          The MainContext value
 */
export const useMainContext = () => {
  const values = useContext(MainContext)
  if (!values) throw new Error("A MainContext provider must be used")

  return values
}
