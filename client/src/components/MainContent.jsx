import { Hero } from "../components/Hero"
import { useEth } from "../contexts/EthContext"
import { useEventWorkflowStatus } from "../contexts/useEventWorkflowStatus"
import { useIsConnectedUserAVoter } from "../contexts/useGetVoter"
import { AddProposal } from "../pages/AddProposal"
import { AddVoter } from "../pages/AddVoter"
import { EndProposal } from "../pages/EndProposal"
import { EndVoting } from "../pages/EndVoting"
import { NotVoter } from "../pages/NotVoter"
import { StartVoting } from "../pages/StartVoting"
import { ALL_STATUS } from "../utils/constants"

const getPage = ({ workflowStatus, connectedUser, owner, isVoter }) => {
  const typeUser = connectedUser === owner ? "owner" : isVoter ? "voter" : "not-voter"

  if (typeUser === "not-voter") return <NotVoter />

  switch (ALL_STATUS[workflowStatus]) {
    case "Ajout des votants": {
      return <AddVoter />
    }
    case "Début des propositions": {
      return <AddProposal />
    }
    case "Fin des propositions": {
      return <EndProposal />
    }
    case "Début du vote": {
      return <StartVoting />
    }
    case "Fin du vote": {
      return <EndVoting />
    }
    // case "Résultat du vote": {
    //   return "show-result"
    // }

    default: {
      return <Hero />
    }
  }
}

// Routing component (routing light).
export const MainContent = () => {
  const {
    state: { owner, connectedUser },
  } = useEth()

  const workflowStatus = useEventWorkflowStatus()
  const isVoter = useIsConnectedUserAVoter()

  return getPage({ workflowStatus, connectedUser, owner, isVoter })
}
