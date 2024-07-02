import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import type { IAuth, IUser } from "../../interfaces";
import { RootState } from "../../store";

const initialState: IAuth = {
  loggedUser: null
}

const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers:({
    updateLoggedInUser: (state, action: PayloadAction<IUser>) => {
      state.loggedUser = action.payload
    },
    logout: (state) => {
      state.loggedUser = null
    }
  }),
})

export const {
  updateLoggedInUser,
  logout,
} = userSlice.actions

export const AuthUser = ((state: RootState)=>state.userState.loggedUser)

export default userSlice.reducer
