import { useLoginMutation } from "../services/api";
import * as _ from   "../../node_modules/@reduxjs/toolkit/dist/query/react/buildHooks";
import { useToast } from "./useToast";

export const useLogin = () => {
  const [login,{data, error, isError, isLoading, isSuccess, isUninitialized}] = useLoginMutation()
  useToast({error, isError, isLoading, isSuccess, isUninitialized, loaderToast: true, successMessage:"We have sent an email, please check spam if not received", successToast: true})

  return {
    login,
    isSuccess,
    data,
    isLoading,
  }
}
