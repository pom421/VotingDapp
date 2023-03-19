import { EthProvider } from "./contexts/EthContext"
import { ChakraProvider } from "@chakra-ui/react"
import { MainContent } from "./components/MainContent"

function App() {
  return (
    <EthProvider>
      <ChakraProvider>
        <div id="App">
          <MainContent />
        </div>
      </ChakraProvider>
    </EthProvider>
  )
}

export default App
