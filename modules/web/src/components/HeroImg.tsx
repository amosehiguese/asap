import Lottie from "lottie-react"
import { heroRobotAnimation, darkRobotAnimation } from "../assets"
import { useAppSelector } from "../hooks/useAppSelector"

type PropTypes = {
  divclasses?: string
  imgclasses?: string
}

const HeroImg = ({divclasses , imgclasses}: PropTypes) => {
  const theme = useAppSelector(state => state.themeState.theme)
  return (
    <div className={divclasses}>
      <div className={imgclasses}>
        {theme === 'dark' ?
          <Lottie className="w-5/6" loop={false} animationData={darkRobotAnimation}/>
          :
          <Lottie className="w-5/6" loop={false} animationData={heroRobotAnimation}/>
        }
      </div>
    </div>
  )
}

export default HeroImg
