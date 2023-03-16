import { Heading, Table, TableContainer, Tbody, Td, Th, Tr } from "@chakra-ui/react"
import { Layout } from "../components/Layout"
import { useEth } from "../contexts/EthContext"

export const InfoPage = () => {
  const {
    state: { contractAddress, connectedUser, networkID, networkName, workflowStatus, transactionHash },
  } = useEth()

  return (
    <Layout>
      <Heading as="h2" size="lg" mb="16">
        Informations
      </Heading>

      <TableContainer>
        <Table variant="simple">
          <Tbody>
            <Tr>
              <Th>Utilisateur connecté</Th>
              <Td>{connectedUser}</Td>
            </Tr>
            <Tr>
              <Th>Réseau</Th>
              <Td>
                {networkName} ({networkID})
              </Td>
            </Tr>
            <Tr>
              <Th>Worklow statut</Th>
              <Td>{workflowStatus}</Td>
            </Tr>
            <Tr>
              <Th>Adresse de contrat</Th>
              <Td>{contractAddress}</Td>
            </Tr>
            <Tr>
              <Th>transactionHash</Th>
              <Td>{transactionHash}</Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
    </Layout>
  )
}
