import * as _ from   "../../node_modules/@reduxjs/toolkit/dist/query/react/buildHooks";
import { useVerifyOtpMutation } from "../services/api";
import { useToast } from "./useToast";
import { useHandleNavigate } from "./useHandleNavigate";
import { useUpdateLogin } from "./useUpdateLogin";

export const useVerifyOtp = () => {
  const [verifyOtp, {error, isError, isLoading, isSuccess, isUninitialized, data}] = useVerifyOtpMutation()
  useToast({error, isError, isLoading, isSuccess, isUninitialized, loaderToast: true, successMessage:"Awesome!🎉 Thank you for verifying the otp", successToast: true})
  useUpdateLogin(isSuccess, data)
  useHandleNavigate("/", isSuccess)

  return {
    verifyOtp,
    isLoading
  }
}
