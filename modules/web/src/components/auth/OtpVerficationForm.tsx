import { zodResolver } from "@hookform/resolvers/zod";
import { otpVerificationSchema, otpVerificationSchemaType } from "../../schemas";
import { FormInput, SubmitButton } from "../common";
import { useForm, SubmitHandler } from "react-hook-form";
import { useVerifyOtp } from "../../hooks/useVerifyOtp";


const OtpVerficationForm = () => {
  const {register, handleSubmit, formState: {errors}}  = useForm<otpVerificationSchemaType>({
    resolver: zodResolver(otpVerificationSchema)
  })
  const { verifyOtp, isLoading } = useVerifyOtp()
  const onSubmit: SubmitHandler<otpVerificationSchemaType> = ({otp}) => {
    verifyOtp({otp: otp})
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
      <div className="flex flex-col gap-y-2">
        <FormInput
          type="text"
          register={{...register("otp")}}
          error={errors.otp?.message}
          maxLength={4}
          placeholder="Enter your OTP"
        />
      </div>

      <SubmitButton disabled={isLoading} className="bg-primary px-6 py-2 rounded-sm" btnText="Verify OTP"/>
    </form>
  )
}

export default OtpVerficationForm
