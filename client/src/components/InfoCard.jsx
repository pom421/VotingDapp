import { Card, CardBody, CardHeader, Heading, Table, TableContainer, Tbody, Td, Th, Tr } from "@chakra-ui/react"
import { useEth } from "../contexts/EthContext"
import { useWorkflowStatus } from "../web3-hooks/useWorkflowStatus"
import { ALL_STATUS } from "../utils/constants"

export const InfoCard = () => {
  const {
    state: { connectedUser, contractAddress, networkID, networkName, owner, transactionHash },
  } = useEth()
  const { workflowStatus } = useWorkflowStatus()

  return (
    <Card mt="8" m="8">
      <CardHeader>
        <Heading as="h2" size="lg" mb="16">
          Informations
        </Heading>
      </CardHeader>

      <CardBody>
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
                <Th>Workflow statut</Th>
                <Td>{ALL_STATUS[workflowStatus]}</Td>
              </Tr>
              <Tr>
                <Th>Adresse de contrat</Th>
                <Td>{contractAddress}</Td>
              </Tr>
              <Tr>
                <Th>Propriétaire du contrat</Th>
                <Td>{owner}</Td>
              </Tr>
              <Tr>
                <Th>transactionHash</Th>
                <Td>{transactionHash}</Td>
              </Tr>
            </Tbody>
          </Table>
        </TableContainer>
      </CardBody>
    </Card>
  )
}
