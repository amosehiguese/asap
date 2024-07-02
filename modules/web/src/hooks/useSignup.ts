import * as _ from   "../../node_modules/@reduxjs/toolkit/dist/query/react/buildHooks";
import { useSignupMutation } from "../services/api";
import { useToast } from "./useToast";

export const useSignup = () => {
  const [signup, {data, isSuccess, isError, isLoading, isUninitialized, error}] = useSignupMutation()
  useToast({error, isError, isLoading, isSuccess, isUninitialized, loaderToast: true})

  return {
    signup,
    isSuccess,
    isLoading,
    data
  }
}
