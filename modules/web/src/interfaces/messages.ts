import { Sender } from "../enums"

export interface IMessage {
  content: string
  sender: Sender
}

export interface IMessagePayload {
  content: string
}
