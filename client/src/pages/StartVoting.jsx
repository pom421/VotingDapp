import { ArrowForwardIcon } from "@chakra-ui/icons"
import { Button, Flex, Heading, Table, TableContainer, Tbody, Td, Th, Thead, Tr, useToast } from "@chakra-ui/react"
import { useCallback, useEffect, useState } from "react"
import { BsHandThumbsUp } from "react-icons/bs"
import { Layout } from "../components/Layout"
import { useEth } from "../contexts/EthContext"
import { VotingContractService } from "../services/VotingContractService"

export const StartVoting = () => {
  const [proposals, setProposals] = useState([])
  const [currentVoter, setCurrentVoter] = useState()
  const toast = useToast()
  const {
    state: { connectedUser, contract, owner },
  } = useEth()

  // Get proposals from past events and update the state.
  const refreshProposals = useCallback(
    async function run() {
      const proposals = await VotingContractService.getInstance({
        contract,
        connectedUser,
      }).getProposalsFromPastEvents()
      setProposals(proposals)
    },

    [contract, connectedUser],
  )

  const refreshVoter = useCallback(
    async function run() {
      const voter = await VotingContractService.getInstance({ contract, connectedUser }).getVoter(connectedUser)
      setCurrentVoter(voter)
    },
    [contract, connectedUser],
  )

  // Fetch proposals when the contract changes.
  useEffect(() => {
    if (contract && connectedUser) {
      refreshProposals()
      refreshVoter()
    }
  }, [contract, connectedUser])

  const handleVote = async (id) => {
    if (connectedUser && contract) {
      try {
        await VotingContractService.getInstance({ contract, connectedUser }).setVote(id)

        // Refresh proposals.
        await refreshProposals()

        // Refresh voter.
        await refreshVoter()

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
