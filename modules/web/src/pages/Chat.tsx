import { ChatBody, ChatHeader } from "../components/chat"

const Chat = () => {
  return (
    <div className="flex flex-col">
      <ChatHeader/>
      <ChatBody/>
    </div>
  )
}

export default Chat
