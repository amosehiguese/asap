import { useLazySendOtpQuery } from "../services/api";
import * as _ from   "../../node_modules/@reduxjs/toolkit/dist/query/react/buildHooks";
import { useToast } from "./useToast";

export const useSendOtp = () => {
  const [sendOtp,{error, isError, isFetching, isSuccess, isUninitialized}] = useLazySendOtpQuery()
  useToast({error, isError, isLoading:isFetching, isSuccess, isUninitialized, loaderToast:true, successMessage:"We have sent an OTP", successToast: true})

  return {
    sendOtp,
    isLoading: isFetching,
    isSuccess
  }
}
