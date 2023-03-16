import { Heading, Table, TableContainer, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react"
import { Layout } from "../components/Layout"
import { useEventVoter } from "../contexts/useEventVoter"

export const AddVoters = () => {
  const { voters } = useEventVoter()

  return (
    <Layout>
      <Heading as="h2" size="lg" mb="16">
        Liste des votants
      </Heading>

      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th># votant</Th>
              <Th>Adresse</Th>
            </Tr>
          </Thead>
          <Tbody>
            {voters.map(({ voterAddress }, index) => (
              <Tr key={voterAddress}>
                <Td>{index + 1}</Td>
                <Td>{voterAddress}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Layout>
  )
}
