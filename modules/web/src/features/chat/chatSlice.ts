import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { IMessage } from "../../interfaces"
import { RootState } from "../../store";


type ChatMessages = {
  messages: IMessage[]
  llmResponse: string
  isLoading: Boolean
  error: string | null
}

const initialState: ChatMessages = {
  messages: [

  ],
  llmResponse: "",
  isLoading: false,
  error: null,
}

const chatSlice = createSlice({
  name: "chatSlice",
  initialState,
  reducers: ({
    setChatMessages: (state, action: PayloadAction<IMessage>) => {
      state.messages.push(action.payload)
    },

    setLlmResponse: (state, action: PayloadAction<string>) => {
      state.llmResponse = action.payload
    },

    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    }


  }),
})

export const {
  setChatMessages,
  setLlmResponse,
  setIsLoading,
  setError,
} = chatSlice.actions

export const ChatMessages = ((state: RootState) => state.chatState.messages)
export const LlmResponse = ((state: RootState) => state.chatState.llmResponse)
export const IsLoading = ((state: RootState) => state.chatState.isLoading)
export const Error = ((state: RootState) => state.chatState.error)

export default chatSlice.reducer
