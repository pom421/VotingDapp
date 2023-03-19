import { Alert, Flex, Heading, HStack, Text } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { BsPerson } from "react-icons/bs"
import { Layout } from "../components/Layout"
import { StatsCard } from "../components/StatsCard"
import { useEth } from "../contexts/EthContext"
import { VotingContractService } from "../services/VotingContractService"

export const ShowResult = () => {
  const {
    state: { connectedUser, contract },
  } = useEth()

  const [proposalData, setProposalData] = useState()

  useEffect(() => {
    async function run() {
      const winningProposalId = await VotingContractService.getInstance({
        contract,
        connectedUser,
      }).getWinningProposalId()

      const proposals = await VotingContractService.getInstance({
        contract,
        connectedUser,
      }).getProposals()

      const winningProposal = proposals.find((proposal) => proposal.id === winningProposalId)

      setProposalData({
        proposalId: winningProposalId,
        description: winningProposal.description,
        voteCount: winningProposal.voteCount,
      })
    }

    if (contract && connectedUser) run()
  }, [contract, connectedUser])

  return (
    <Layout>
      <Flex justifyContent="space-between">
        <Heading as="h2" size="lg" mb="16">
          Résultat du vote
        </Heading>
      </Flex>

      <Alert>{"La phase de vote est terminé."}</Alert>

      <HStack>
        <StatsCard title={"Vote"} stat={proposalData.voteCount} icon={<BsPerson size={"3em"} />} />
        <Text>{proposalData.description}</Text>
      </HStack>
    </Layout>
  )
}
