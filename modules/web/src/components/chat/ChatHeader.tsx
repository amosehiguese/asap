import { Share } from 'lucide-react'
import Header from '../Header'
import { Button } from '../ui/button'
import Lottie from "lottie-react"
import { botAnimation } from '../../assets'


const ChatHeader = () => {
  return (
      <Header text='Symptom Checker'>
        <div className="w-10 h-10 hidden lg:flex">
          <Lottie loop={true} animationData={botAnimation}/>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto gap-1.5 text-sm"
        >
            <Share className="size-3.5" />
            Export to PDF
        </Button>
      </Header>
  )
}

export default ChatHeader
