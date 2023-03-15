import { useMainContext } from "../contexts/MainContext"
import Hero from "./Hero"
import Layout from "./Layout"

export const PageIndex = {
  hero: <Hero />,
  layout: <Layout />,
}

export const defaultPage = "hero"

export const MainContent = () => {
  const { step } = useMainContext()

  return PageIndex[step] || defaultPage
}
