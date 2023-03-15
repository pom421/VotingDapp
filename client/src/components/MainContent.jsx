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
  //   let componentToDisplay = null

  console.log("step", step)

  // eslint-disable-next-line no-constant-condition
  //   switch (step) {
  //     case PageIndex.HERO: {
  //       componentToDisplay = <Hero />
  //       break
  //     }
  //     default: {
  //       componentToDisplay = <Layout />
  //     }
  //   }

  return PageIndex[step] || defaultPage
}
