import { ArrowForwardIcon } from "@chakra-ui/icons"
import {
  Alert,
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
import { VotingContractService } from "../services/VotingContractService"
import { useWorkflowStatus } from "../web3-hooks/useEventWorkflowStatus"
import { useGetProposals } from "../web3-hooks/useGetProposals"

export const AddProposal = () => {
  const {
    state: { connectedUser, contract, owner },
  } = useEth()
  const { proposals, refreshProposals } = useGetProposals()
  const { refreshWorkflowStatus } = useWorkflowStatus()

  const [proposalToAdd, setProposalToAdd] = useState("")
  const toast = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (connectedUser && contract) {
      try {
        await contract.methods.addProposal(proposalToAdd).send({ from: connectedUser })
        await refreshProposals()

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
        await VotingContractService.getInstance({ contract, connectedUser }).endProposalsRegistering()
        await refreshWorkflowStatus()
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
      {connectedUser && connectedUser === owner && (
        <Alert>
          Les votants peuvent maintenant ajouter des propositions. Vous pouvez terminer la phase de proposition en
          cliquant sur le bouton ci-dessus.
        </Alert>
      )}

      {connectedUser && connectedUser !== owner && (
        <>
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
                  proposals.map(({ proposalId, description }, index) => (
                    <Tr key={proposalId}>
                      <Td>{index + 1}</Td>
                      <Td>{description}</Td>
                    </Tr>
                  ))}
              </Tbody>
            </Table>
          </TableContainer>
        </>
      )}
    </Layout>
  )
}
