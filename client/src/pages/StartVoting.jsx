import { ArrowForwardIcon } from "@chakra-ui/icons"
import { Button, Flex, Heading, Table, TableContainer, Tbody, Td, Th, Thead, Tr, useToast } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { Layout } from "../components/Layout"
import { useEth } from "../contexts/EthContext"
import { getAllProposals } from "../contexts/useEventProposal"
import { VotingContractService } from "../services/VotingContractService"
import { InfoPage } from "./InfoPage"
import { BsHandThumbsUp } from "react-icons/bs"

export const StartVoting = () => {
  const [proposals, setProposals] = useState([])
  const [voter, setVoter] = useState()
  const toast = useToast()
  const {
    state: { connectedUser, contract, owner, deployTransaction },
  } = useEth()

  // Fetch proposals when the contract changes.
  useEffect(() => {
    async function run() {
      const from = deployTransaction.blockNumber
      const proposals = await getAllProposals({ contract, from, connectedUser })
      const voter = await VotingContractService.getInstance({ contract, connectedUser }).getVoter(connectedUser)

      setProposals(proposals)
      setVoter(voter)
    }

    if (connectedUser !== owner) run()
  }, [contract, deployTransaction.blockNumber, connectedUser])

  // const handleVote = async (e) => {
  //   e.preventDefault()

  //   if (connectedUser && contract) {
  //     try {
  //       console.debug("ajout de " + proposalToAdd)
  //       await contract.methods.StartVoting(proposalToAdd).send({ from: connectedUser })

  //       // Refresh proposals.
  //       const proposals = await getAllProposals({ contract, from: deployTransaction.blockNumber, connectedUser })
  //       setProposals(proposals)
  //       toast({
  //         title: "Proposition ajoutée.",
  //         description: "L'ajout s'est bien passé.",
  //         status: "success",
  //         duration: 5000,
  //         isClosable: true,
  //       })
  //     } catch (error) {
  //       toast({
  //         title: "Problème",
  //         description: "L'ajout n'a pas pu être réalisé.",
  //         status: "error",
  //         duration: 5000,
  //         isClosable: true,
  //       })
  //       console.error("Error while adding proposal", error)
  //     } finally {
  //       setProposalToAdd("")
  //     }
  //   }
  // }

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
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {proposals &&
                  proposals.map(({ proposalId, description }, index) => (
                    <Tr key={proposalId}>
                      <Td>{index + 1}</Td>
                      <Td>{description}</Td>
                      <Td>
                        <Button
                          disabled={voter && voter.hasVoted}
                          title={voter && voter.hasVoted && "Vous avez déjà voté"}
                          rightIcon={<BsHandThumbsUp />}
                          // onClick={handleVote}
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
      <InfoPage />
    </Layout>
  )
}
