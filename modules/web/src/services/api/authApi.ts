import { createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import * as _ from   "../../../node_modules/@reduxjs/toolkit/dist/query/react/buildHooks";

import type { IOtp, IResetPassword, IUser } from "../../interfaces";
import { url } from "./base";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${url}/auth`,
    credentials: "include"
  }),

  endpoints: (builder) => ({
    login: builder.mutation<IUser, Pick<IUser,'email'> & {password: string}>({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials
      })
    }),

    signup: builder.mutation<IUser, Pick<IUser, 'firstname' | 'lastname' | 'email'> & {password: string}>({
      query: (credentials) => ({
        url: "/signup",
        method: "POST",
        body: credentials
      })
    }),

    forgotPassword: builder.mutation<void, Pick<IUser, 'email'>>({
      query: (credentials) => ({
        url: "/forgot-password",
        method: "POST",
        body: credentials
      })
    }),

    resetPassword: builder.mutation<void, IResetPassword>({
      query: (credentials) => ({
        url: "/reset-password",
        method: "POST",
        body: credentials
      })
    }),

    verifyOtp: builder.mutation<IUser, IOtp>({
      query: (credentials) => ({
        url: "/verify-email",
        method: "POST",
        body: credentials
      })
    }),

    verifyPassword: builder.mutation<void, {password: string}>({
      query: ({password}) => ({
        url: "/verify-password",
        method: "POST",
        body: {password}
      })
    }),

    sendOtp: builder.query<void,void>({
      query: () => "/send"
    }),

    logout: builder.query<void,void>({
      query: () => "/logout"
    })
  })
})

export const {
  useLoginMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useSignupMutation,
  useVerifyOtpMutation,
  useVerifyPasswordMutation,
  useLazyLogoutQuery,
  useLazySendOtpQuery,
} = authApi
