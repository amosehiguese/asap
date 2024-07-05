import Lottie from "lottie-react"
import { heroRobotAnimation } from "../assets"

type PropTypes = {
  divclasses?: string
  imgclasses?: string
}

const HeroImg = ({divclasses , imgclasses}: PropTypes) => {
  return (
    <div className={divclasses}>
      <div className={imgclasses}>
        <Lottie className="w-5/6" loop={false} animationData={heroRobotAnimation}/>
      </div>
    </div>
  )
}

export default HeroImg
