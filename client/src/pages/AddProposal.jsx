import { ArrowForwardIcon } from "@chakra-ui/icons"
import {
  Button,
  Flex,
  Heading,
  Input,
  InputGroup,
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
import { useEventProposal } from "../contexts/useEventProposal"
import { InfoPage } from "./InfoPage"

export const AddProposal = () => {
  const { proposals } = useEventProposal()

  const [proposalToAdd, setProposalToAdd] = useState("")
  const toast = useToast()

  const {
    state: { connectedUser, contract, owner },
  } = useEth()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (connectedUser && contract) {
      try {
        console.debug("ajout de " + proposalToAdd)
        await contract.methods.addProposal(proposalToAdd).send({ from: connectedUser })
        toast({
          title: "Proposition ajoutée.",
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
        console.error("Error while adding proposal", error)
      } finally {
        setProposalToAdd("")
      }
    }
  }

  const endProposal = async () => {
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
        await contract.methods.endProposalsRegistering().send({ from: connectedUser })
      } catch (error) {
        console.error("Error while ending proposal", error)
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

  return (
    <Layout>
      <Flex justifyContent="space-between">
        <Heading as="h2" size="lg" mb="16">
          Ajout des propositions
        </Heading>
        {connectedUser && connectedUser === owner && (
          <Button leftIcon={<ArrowForwardIcon />} onClick={endProposal}>
            Terminer la phase de proposition
          </Button>
        )}
      </Flex>
      {connectedUser && connectedUser !== owner && (
        <form onSubmit={handleSubmit}>
          <InputGroup>
            <Input
              type="tel"
              placeholder="Ex: Je mets ici ma proposition..."
              onChange={(e) => setProposalToAdd(e.target.value)}
              value={proposalToAdd}
            />
            <Button type="submit" ml="4" mb="4">
              Ajouter
            </Button>
          </InputGroup>
        </form>
      )}
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th># proposition</Th>
              <Th>Proposition</Th>
            </Tr>
          </Thead>
          <Tbody>
            {proposals &&
              proposals.map(({ proposalId }, index) => (
                <Tr key={proposalId}>
                  <Td>{index + 1}</Td>
                  <Td>{proposalId}</Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
      </TableContainer>
      <InfoPage />
    </Layout>
  )
}
