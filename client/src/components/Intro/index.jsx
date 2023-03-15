import Welcome from "./Welcome"
import Tree from "./Tree"
import Desc from "./Desc"
import { Button } from "@chakra-ui/react"

function Intro() {
  return (
    <>
      <Welcome />
      <Tree />
      <Desc />
      <Button colorScheme="teal" size="lg">
        Toto
      </Button>
    </>
  )
}

export default Intro
