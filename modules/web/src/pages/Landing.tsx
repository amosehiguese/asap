import Lottie from "lottie-react"
import { Hero } from "../components"
import { bgLine } from "../assets"
const Landing = () => {
  return <div>
    <div className="absolute -z-20 align-element min-h-screen left-0 right-0 lg:top-0 ">
      <Lottie loop={true} animationData={bgLine} className="w-full absolute left-0 right-0"/>
    </div>
    <Hero/>
  </div>
}

export default Landing
