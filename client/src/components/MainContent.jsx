import { useMainContext } from "../contexts/MainContext"
import { AddVoters } from "../pages/AddVoter"
import Hero from "./Hero"

export const PageIndex = {
  hero: <Hero />,
  layout: <AddVoters />,
}

export const defaultPage = "layout"

// Routing component (routing light).
export const MainContent = () => {
  const { step } = useMainContext()

  return PageIndex[step] || defaultPage
}
