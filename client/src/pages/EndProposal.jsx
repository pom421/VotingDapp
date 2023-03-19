import { ArrowForwardIcon } from "@chakra-ui/icons"
import { Alert, Button, Flex, Heading, useToast } from "@chakra-ui/react"
import { Layout } from "../components/Layout"
import { useEth } from "../contexts/EthContext"
import { VotingContractService } from "../services/VotingContractService"
import { useWorkflowStatus } from "../web3-hooks/useEventWorkflowStatus"

export const EndProposal = () => {
  const {
    state: { connectedUser, contract, owner },
  } = useEth()
  const { refreshWorkflowStatus } = useWorkflowStatus()
  const toast = useToast()

  const startVoting = async () => {
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
        await VotingContractService.getInstance({ contract, connectedUser }).startVotingSession()
        await refreshWorkflowStatus()
      } catch (error) {
        console.error("Error while starting voting", error)
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
          {"En attente du vote"}
        </Heading>
        {connectedUser && connectedUser === owner && (
          <Button leftIcon={<ArrowForwardIcon />} onClick={startVoting}>
            Commencer le vote
          </Button>
        )}
      </Flex>

      <Alert>{"La phase de vote n'a pas encore commencé."}</Alert>
    </Layout>
  )
}
