import { Heading, Table, TableContainer, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react"
import { Layout } from "../components/Layout"

export const AddVoters = () => {
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
            <Tr>
              <Td>Voteur #1</Td>
              <Td>0x242e5908Fe2DACdb90D99d5f4b311f9f64Cff51C</Td>
            </Tr>
            <Tr>
              <Td>Voteur #2</Td>
              <Td>0x111e5908Fe2DACdb90D99d5f4b311f9f64Cff51C</Td>
            </Tr>
            <Tr>
              <Td>Voteur #3</Td>
              <Td>0x666e5908Fe2DACdb90D99d5f4b311f9f64Cff51C</Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
    </Layout>
  )
}
