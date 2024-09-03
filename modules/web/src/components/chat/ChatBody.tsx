import HeroImg from '../HeroImg'
import Messages from './Messages'
import { Badge } from '../ui/badge'
import MessageTextArea from './MessageTextArea'
import { useAppSelector } from '../../hooks/useAppSelector'
import { ChatMessages } from '../../features/chat/chatSlice'

const ChatBody = () => {
  const messages = useAppSelector(ChatMessages)

  return (
    <main className='grid flex-1 gap-4 overflow-auto p-4 md:grid-cols-2 lg:grid-cols-3'>
      <div className="relative hidden flex-col justify-center gap-8 md:flex">
        <HeroImg/>
      </div>

      <div className="relative flex h-full min-h-[50vh] flex-col rounded-xl bg-muted/50 p-4 lg:col-span-2">
        <Badge variant='outline' className='absolute right-3 top-3'>
          Output
        </Badge>

        {/* Mesages */}
        <Messages messages={messages}/>
        <MessageTextArea/>
      </div>
    </main>
  )
}

export default ChatBody
