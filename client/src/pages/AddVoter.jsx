import { ArrowForwardIcon } from "@chakra-ui/icons"
import {
  Button,
  Flex,
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
import { BiUserPlus } from "react-icons/bi"
import { Layout } from "../components/Layout"
import { useEth } from "../contexts/EthContext"
import { useWorkflowStatus } from "../web3-hooks/useEventWorkflowStatus"
import { useGetVoters } from "../web3-hooks/useGetVoters"
import { WaitingMessage } from "./WaitingMessage"

export const AddVoter = () => {
  const {
    state: { connectedUser, contract, owner },
  } = useEth()
  const { voters, refreshVoters } = useGetVoters()
  const { refreshWorkflowStatus } = useWorkflowStatus()
  const [addressToAdd, setAddressToAdd] = useState("")
  const toast = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (connectedUser && contract) {
      try {
        await contract.methods.addVoter(addressToAdd).send({ from: connectedUser })
        await refreshVoters()

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

  const startProposal = async () => {
    if (!connectedUser || connectedUser !== owner) {
      toast({
        title: "Non autorisée",
        description: "Vous n'êtes pas le propriétaire du contrat.",
        status: "error",
        duration: 5000,
        isClosable: true,
      })
      return
    }

    if (connectedUser && contract) {
      try {
        await contract.methods.startProposalsRegistering().send({ from: connectedUser })
        await refreshWorkflowStatus()
      } catch (error) {
        console.error("Error while starting proposal", error)
        toast({
          title: "Problème",
          description: "Impossible de mettre à jour le status sur la blockchain.",
          status: "error",
          duration: 5000,
          isClosable: true,
        })
      }
    }
  }

  if (connectedUser && connectedUser !== owner) {
    return <WaitingMessage description="La phase de proposition n'a pas commencé." />
  }

  return (
    <Layout>
      <Flex justifyContent="space-between">
        <Heading as="h2" size="lg" mb="16">
          Liste des votants
        </Heading>
        {connectedUser && connectedUser === owner && (
          <Button leftIcon={<ArrowForwardIcon />} onClick={startProposal}>
            Passer au début des propositions
          </Button>
        )}
      </Flex>

      <form onSubmit={handleSubmit}>
        <InputGroup>
          {/* eslint-disable-next-line react/no-children-prop */}
          <InputLeftElement pointerEvents="none" children={<BiUserPlus color="gray.300" />} />
          <Input
            type="text"
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
            {voters &&
              voters.map(({ voterAddress }, index) => (
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
