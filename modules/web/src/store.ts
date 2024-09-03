import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./features/theme/themeSlice"
import userReducer from "./features/user/userSlice"
import chatReducer from "./features/chat/chatSlice"
import { authApi } from "./services/api";


export const store = configureStore({
    reducer: {
      [authApi.reducerPath]: authApi.reducer,
      themeState: themeReducer,
      userState: userReducer,
      chatState: chatReducer,
    },

    middleware: (getDefaultMiddleware)=> getDefaultMiddleware()
    .concat(authApi.middleware)
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

