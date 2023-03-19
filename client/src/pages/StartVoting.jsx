import { ArrowForwardIcon } from "@chakra-ui/icons"
import { Button, Flex, Heading, Table, TableContainer, Tbody, Td, Th, Thead, Tr, useToast } from "@chakra-ui/react"
import { BsHandThumbsUp } from "react-icons/bs"
import { Layout } from "../components/Layout"
import { useEth } from "../contexts/EthContext"
import { VotingContractService } from "../services/VotingContractService"
import { useWorkflowStatus } from "../web3-hooks/useEventWorkflowStatus"
import { useGetProposals } from "../web3-hooks/useGetProposals"
import { useGetVoter } from "../web3-hooks/useGetVoter"

export const StartVoting = () => {
  const {
    state: { connectedUser, contract, owner },
  } = useEth()
  const { currentVoter, refreshCurrentVoter } = useGetVoter()
  const { proposals, refreshProposals } = useGetProposals()
  const { refreshWorkflowStatus } = useWorkflowStatus()
  const toast = useToast()

  const handleVote = async (id) => {
    if (connectedUser && contract) {
      try {
        await VotingContractService.getInstance({ contract, connectedUser }).setVote(id)

        // Refresh proposals.
        await refreshProposals()

        // Refresh voter.
        await refreshCurrentVoter()

        toast({
          title: "Succès",
          description: "Votre vote a été pris en compte.",
          status: "success",
          duration: 5000,
          isClosable: true,
        })
      } catch (error) {
        toast({
          title: "Problème",
          description: "Le vote n'a pas pu être pris en compte.",
          status: "error",
          duration: 5000,
          isClosable: true,
        })
        console.error("Error while voting", error)
      }
    }
  }

  const endVoting = async () => {
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
        await VotingContractService.getInstance({ contract, connectedUser }).endVotingSession()
        await refreshWorkflowStatus()
      } catch (error) {
        console.error("Error while ending voting session", error)
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
          Vote des propositions
        </Heading>
        {connectedUser && connectedUser === owner && (
          <Button leftIcon={<ArrowForwardIcon />} onClick={endVoting}>
            Terminer le vote et afficher les résultats
          </Button>
        )}
      </Flex>
      {connectedUser && connectedUser !== owner && (
        <>
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th># proposition</Th>
                  <Th>Proposition</Th>
                  <Th># vote</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {proposals &&
                  proposals.map(({ proposalId, description, voteCount }) => (
                    <Tr key={proposalId}>
                      <Td>{proposalId}</Td>
                      <Td>{description}</Td>
                      <Td>{voteCount}</Td>
                      <Td>
                        <Button
                          isDisabled={currentVoter && currentVoter.hasVoted}
                          title={currentVoter && currentVoter.hasVoted ? "Vous avez déjà voté" : ""}
                          rightIcon={<BsHandThumbsUp />}
                          onClick={() => handleVote(proposalId)}
                        >
                          Voter
                        </Button>
                      </Td>
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
