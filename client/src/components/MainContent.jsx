import { useEth } from "../contexts/EthContext"
import { useEventVoter } from "../contexts/useEventVoter"
import { useEventWorkflowStatus } from "../contexts/useEventWorkflowStatus"
import { AddProposal } from "../pages/AddProposal"
import { AddVoter } from "../pages/AddVoter"
import { NotVoter } from "../pages/NotVoter"
import { ALL_STATUS } from "../utils/constants"

const getPage = ({ workflowStatus, connectedUser, owner, voters }) => {
  const typeUser = connectedUser === owner ? "owner" : voters.includes(connectedUser) ? "voter" : "not-voter"

  if (typeUser === "not-voter") return <NotVoter />

  switch (ALL_STATUS[workflowStatus]) {
    case "Ajout des votants": {
      return <AddVoter />
    }
    case "Début des propositions": {
      return <AddProposal />
    }
    // case "Fin des propositions": {
    //   return "end-proposal"
    // }
    // case "Début du vote": {
    //   return "start-voting"
    // }
    // case "Fin du vote": {
    //   return "end-voting"
    // }
    // case "Résultat du vote": {
    //   return "show-result"
    // }

    default: {
      return <NotVoter />
    }
  }
}

// Routing component (routing light).
export const MainContent = () => {
  const {
    state: { owner, connectedUser },
  } = useEth()
  const { voters } = useEventVoter()
  const workflowStatus = useEventWorkflowStatus()

  const addressesVoters = voters.map((element) => element.voterAddress)

  return getPage({ workflowStatus, connectedUser, owner, voters: addressesVoters })
}
