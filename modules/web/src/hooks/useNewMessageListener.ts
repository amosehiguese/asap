import { Events } from "../enums/events"
import { setChatMessages } from "../features/chat/chatSlice"
import { AuthUser } from "../features/user/userSlice"
import { IMessage } from "../interfaces/messages"
import { useAppDispatch } from "./useAppDispatch"
import { useAppSelector } from "./useAppSelector"
import { useSocketEvent } from "./useSocketEvent"


export const useNewMessageListener = () => {
  const dispatch = useAppDispatch()
  const user = useAppSelector(AuthUser)

  useSocketEvent(Events.NEW_MESSAGE, (data: IMessage) => {
    if (user) {
      const newMessage: IMessage = {
        content: data.content,
        sender: data.sender
      }
      dispatch(setChatMessages(newMessage))
    }
  })
}
