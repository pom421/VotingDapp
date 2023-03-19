import { Alert, Box, Flex, Heading, Highlight, HStack, Stack, Text, useColorModeValue } from "@chakra-ui/react"

export const NotVoter = () => {
  return (
    <>
      <Box bg={useColorModeValue("gray.100", "gray.900")} px={4}>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <HStack spacing={8} alignItems={"center"}>
            <Box>
              <Text color="blue.700" fontSize="2xl">
                <Highlight query={["My"]} styles={{ px: "1", py: "1", bg: "orange.100" }}>
                  Oh.My.Vote
                </Highlight>
              </Text>
            </Box>
          </HStack>
        </Flex>
      </Box>

      <Stack mt="8" maxW="980" mx="auto" gap="4">
        <Heading as="h2" size="lg" mb="16">
          {"Vous n'êtes pas votant"}
        </Heading>

        <Alert>
          {
            "Vous n'êtes pas encore inscrit en tant que votant. Veuillez vous inscrire en faisant une demande au propriétaire."
          }
        </Alert>
      </Stack>
    </>
  )
}
