import { getSocket } from "../context/socket"
import { Events, Sender } from "../enums"
import { setChatMessages } from "../features/chat/chatSlice"
import { AuthUser } from "../features/user/userSlice"
import { IMessage } from "../interfaces"
import { useAppDispatch } from "./useAppDispatch"
import { useAppSelector } from "./useAppSelector"


export const useSendNewMessage = () => {
  const dispatch = useAppDispatch()
  const socket = getSocket()
  const userId = useAppSelector(AuthUser)?.id

  const sendMessage = async(message?: string) => {
    if (message && userId) {
      const newMessage: IMessage = {
        content: message,
        sender: Sender.User
      }

      socket?.emit(Events.SEND_MESSAGE, newMessage)
      dispatch(setChatMessages(newMessage))
    }
  }

  return {
    sendMessage
  }
}
