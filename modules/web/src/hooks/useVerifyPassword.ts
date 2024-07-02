import * as _ from   "../../node_modules/@reduxjs/toolkit/dist/query/react/buildHooks";
import { useVerifyPasswordMutation } from "../services/api";
import { useToast } from "./useToast";

export const useVerifyPassword = () => {
  const [verifyPassword, {error, isError, isLoading, isSuccess, isUninitialized}] = useVerifyPasswordMutation()
  useToast({error, isError, isLoading, isSuccess, isUninitialized, successToast: true, successMessage:"We have sent you an email with verification link, please check spam if not received"})

  return {
    verifyPassword,
    isLoading,
    isSuccess
  }
}
