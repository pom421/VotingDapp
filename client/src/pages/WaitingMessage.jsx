import { Alert, Heading } from "@chakra-ui/react"
import { Layout } from "../components/Layout"

export const WaitingMessage = ({ title = "En attente", description }) => {
  return (
    <Layout>
      <Heading as="h2" size="lg" mb="16">
        {title}
      </Heading>

      <Alert>{description}</Alert>
    </Layout>
  )
}
