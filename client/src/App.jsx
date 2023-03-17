import { EthProvider } from "./contexts/EthContext"
// import { DebugInfo } from "./components/DebugInfo"
// import { DEBUG } from "./utils/constants"
import { ChakraProvider } from "@chakra-ui/react"
import { MainContent } from "./components/MainContent"
import { MainContextProvider } from "./contexts/MainContext"

function App() {
  return (
    <EthProvider>
      <ChakraProvider>
        <div id="App">
          {/* {DEBUG && <DebugInfo />} */}
          <MainContextProvider>
            <MainContent />
          </MainContextProvider>
        </div>
      </ChakraProvider>
    </EthProvider>
  )
}

export default App
