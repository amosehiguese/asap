import Lottie from "lottie-react"
import { authBotAnimation,chatAnimation } from "../assets"

import Logo from "./Logo"

const AppBranding = () => {

  return (
        <div className="text-inherit bg-inherit flex flex-col gap-y-2">
            <div className="flex flex-col gap-y-1">
                <div className="flex items-center gap-x-4">
                    <Logo hidden={false} sm={false}/>
                    <div className="w-10 h-10">
                        <Lottie loop={true} animationData={chatAnimation}/>
                    </div>
                </div>
                <h2 className="text-2xl font-semibold">Your AI-Based Symptom Checker</h2>
            </div>

            <p className="text-white-500 text-lg">Lets give you a quick feedback on your health ASAP.</p>


            <div className="relative hidden flex-col justify-center gap-8 md:flex">
            <div className=''>
              <Lottie className="w-6/6" loop={true} animationData={authBotAnimation}/>
            </div>

            </div>


        </div>

  )
}

export default AppBranding
