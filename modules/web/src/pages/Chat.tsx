import { useEffect } from "react"
import { ChatBody, ChatHeader } from "../components/chat"
import { AuthUser } from "../features/user/userSlice"
import { useAppSelector } from "../hooks/useAppSelector"
import { useNewMessageListener } from "../hooks/useNewMessageListener"
import { useAppDispatch } from "../hooks/useAppDispatch"
import { setChatMessages } from "../features/chat/chatSlice"
import { Sender } from "../enums"
import { IMessage } from "../interfaces"

const Chat = () => {
  const user = useAppSelector(AuthUser)
  const dispatch = useAppDispatch()
  useNewMessageListener()

  useEffect(()=>{
    const welcomeMsg: IMessage =  {
      "content": `👋 Welcome to ASAP, ${user?.firstname}! How are you feeling today? 😊`,
      "sender": Sender.Asap
    }

    dispatch(setChatMessages(welcomeMsg))
  },[])
  return (
    <div className="flex flex-col">
      <ChatHeader/>
      <ChatBody/>
    </div>
  )
}

export default Chat
