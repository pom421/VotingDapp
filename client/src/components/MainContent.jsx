import { useMainContext } from "../contexts/MainContext"
import { AddVoters } from "../pages/AddVoter"
import { InfoPage } from "../pages/InfoPage"
import { Hero } from "./Hero"

export const PageIndex = {
  hero: <Hero />,
  layout: <AddVoters />,
  "info-page": <InfoPage />,
}

export const defaultPage = "layout"

// Routing component (routing light).
export const MainContent = () => {
  const { step } = useMainContext()

  return PageIndex[step] || defaultPage
}
