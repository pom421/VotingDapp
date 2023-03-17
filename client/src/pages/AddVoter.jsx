import { BiUserPlus } from "react-icons/bi"
import {
  Button,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useToast,
} from "@chakra-ui/react"
import { useState } from "react"
import { Layout } from "../components/Layout"
import { useEth } from "../contexts/EthContext"
import { useEventVoter } from "../contexts/useEventVoter"

export const AddVoters = () => {
  const { voters } = useEventVoter()
  const [addressToAdd, setAddressToAdd] = useState("")
  const toast = useToast()

  const {
    state: { connectedUser, contract },
  } = useEth()

  const handleSubmit = async (e) => {
    e.preventDefault()

    console.log("dans handleSubmit", connectedUser, contract)

    if (connectedUser && contract) {
      try {
        console.debug("ajout de " + addressToAdd)
        await contract.methods.addVoter(addressToAdd).send({ from: connectedUser })
        toast({
          title: "Adresse ajoutée.",
          description: "L'ajout s'est bien passé.",
          status: "success",
          duration: 5000,
          isClosable: true,
        })
      } catch (error) {
        toast({
          title: "Problème",
          description: "L'ajout n'a pas pu être réalisé.",
          status: "error",
          duration: 5000,
          isClosable: true,
        })
        console.error("Error while adding voter", error)
      } finally {
        setAddressToAdd("")
      }
    }
  }

  return (
    <Layout>
      <Heading as="h2" size="lg" mb="16">
        Liste des votants
      </Heading>

      <form onSubmit={handleSubmit}>
        <InputGroup>
          {/* eslint-disable-next-line react/no-children-prop */}
          <InputLeftElement pointerEvents="none" children={<BiUserPlus color="gray.300" />} />
          <Input
            type="tel"
            placeholder="Ex: 0x80971420de16e80dc8D3ED228E5135EbdB407013"
            onChange={(e) => setAddressToAdd(e.target.value)}
            value={addressToAdd}
          />
          <Button type="submit" ml="4" mb="4">
            Ajouter
          </Button>
        </InputGroup>
      </form>

      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th># votant</Th>
              <Th>Adresse</Th>
            </Tr>
          </Thead>
          <Tbody>
            {voters.map(({ voterAddress }, index) => (
              <Tr key={voterAddress}>
                <Td>{index + 1}</Td>
                <Td>{voterAddress}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Layout>
  )
}
