import { Hero } from "../components/Hero"
import { useEth } from "../contexts/EthContext"
import { AddProposal } from "../pages/AddProposal"
import { AddVoter } from "../pages/AddVoter"
import { EndProposal } from "../pages/EndProposal"
import { NotVoter } from "../pages/NotVoter"
import { ShowResult } from "../pages/ShowResult"
import { StartVoting } from "../pages/StartVoting"
import { ALL_STATUS } from "../utils/constants"
import { useConnectedUserIsVoter } from "../web3-hooks/useConnectedUserIsVoter"
import { useWorkflowStatus } from "../web3-hooks/useWorkflowStatus"

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
      return <ShowResult />
    }

    default: {
      return <Hero />
    }
  }
}

// "Routing component"
export const MainContent = () => {
  const {
    state: { owner, connectedUser },
  } = useEth()

  const { workflowStatus } = useWorkflowStatus()
  const isVoter = useConnectedUserIsVoter()

  return getPage({ workflowStatus, connectedUser, owner, isVoter })
}
