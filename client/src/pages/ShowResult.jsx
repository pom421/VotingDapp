import { Alert, Flex, Heading } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { Layout } from "../components/Layout"
import { StatsCard } from "../components/StatsCard"
import { useEth } from "../contexts/EthContext"
import { VotingContractService } from "../services/VotingContractService"

export const ShowResult = () => {
  const {
    state: { connectedUser, contract },
  } = useEth()

  const [proposalData, setProposalData] = useState({
    proposalId: 0,
    description: "",
    voteCount: 0,
  })

  useEffect(() => {
    async function run() {
      const winningProposalId = await VotingContractService.getInstance({
        contract,
        connectedUser,
      }).getWinningProposalId()

      const winningProposal = await VotingContractService.getInstance({
        contract,
        connectedUser,
      }).getOneProposal(winningProposalId)

      console.log("winningProposal", winningProposal)

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

      <StatsCard proposal={proposalData} />
    </Layout>
  )
}
