import { Card, CardBody, CardFooter, CardHeader, Heading, HStack, Text } from "@chakra-ui/react"

export const StatsCard = ({ proposal }) => {
  const { proposalId, description, voteCount } = proposal

  return (
    <HStack>
      <Card>
        <CardHeader>
          <Heading size="md"> Proposition gagnante #{proposalId}</Heading>
        </CardHeader>
        <CardBody>
          <Text>{description}</Text>
        </CardBody>
        <CardFooter>
          <Text fontSize="2xl">{voteCount} votes</Text>
        </CardFooter>
      </Card>
    </HStack>
  )
}
