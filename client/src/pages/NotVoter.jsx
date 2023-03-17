import { Alert, Heading } from "@chakra-ui/react"
import { Layout } from "../components/Layout"

export const NotVoter = () => {
  return (
    <Layout>
      <Heading as="h2" size="lg" mb="16">
        {"Page d'attente"}
      </Heading>

      <Alert>
        {
          "Vous n'êtes pas encore inscrit en tant que votant. Veuillez vous inscrire en faisant une demande au propriétaire."
        }
      </Alert>
    </Layout>
  )
}
