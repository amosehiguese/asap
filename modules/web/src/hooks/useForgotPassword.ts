import { useForgotPasswordMutation } from "../services/api";
import * as _ from   "../../node_modules/@reduxjs/toolkit/dist/query/react/buildHooks";
import { useToast } from "./useToast";

export const useForgotPassword = () => {
  const [forgotPassword, {error, isError, isLoading, isSuccess, isUninitialized}] = useForgotPasswordMutation()
  useToast({error, isError, isLoading, isSuccess, isUninitialized, loaderToast: true, successMessage:"We have sent an email, please check spam if not received", successToast: true})

  return {
    forgotPassword,
    isLoading,
  }
}
