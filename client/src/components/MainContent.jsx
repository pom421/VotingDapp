import { useEth } from "../contexts/EthContext"
// import { useMainContext } from "../contexts/MainContext"
import { useEventVoter } from "../contexts/useEventVoter"
import { useEventWorkflowStatus } from "../contexts/useEventWorkflowStatus"
import { AddVoters } from "../pages/AddVoter"
import { InfoPage } from "../pages/InfoPage"
import { NotVoter } from "../pages/NotVoter"
import { Hero } from "./Hero"

export const PageIndex = {
  hero: <Hero />,
  "add-voter": <AddVoters />,
  "info-page": <InfoPage />,
  // "add-proposal": <AddProposal />,
  // voting: <Voting />,
  // result: <Result />,
  "not-voter": <NotVoter />,
  // "error-wallet": <ErrorWallet />,
}

export const defaultPage = "add-voter"

const getStep = ({ workflowStatus, connectedUser, owner, voters }) => {
  switch (workflowStatus) {
    case "0": {
      // Registering voters
      if (connectedUser === owner) {
        return "add-voter"
      } else if (voters.includes(connectedUser)) {
        return "waiting-voting"
      }
      return "not-voter"
    }
    default: {
      console.error("TBD", workflowStatus)
    }
  }
}

// Routing component (routing light).
export const MainContent = () => {
  // const { step, setStep } = useMainContext()
  const {
    state: { owner, connectedUser },
  } = useEth()
  const { voters } = useEventVoter()
  const workflowStatus = useEventWorkflowStatus()

  const step = getStep({ workflowStatus, connectedUser, owner, voters })

  console.debug("step", step)

  return PageIndex[step || defaultPage]
}
