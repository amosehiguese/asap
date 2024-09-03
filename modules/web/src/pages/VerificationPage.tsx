import { Helmet } from "react-helmet-async";
import { OtpVerficationForm } from "../components/auth";
import { useSendOtp } from "../hooks/useSendOtp";
import { AuthUser } from "../features/user/userSlice";
import { useAppSelector } from "../hooks/useAppSelector";
import { Button } from "../components/ui/button";

const VerificationPage = () => {
  const user = useAppSelector(AuthUser)
  const {sendOtp, isLoading, isSuccess} = useSendOtp()

  const handleSendOtp = () => {
    sendOtp()
  }
  return (
    <>
    <Helmet>
        <title>Email Verification | Asap</title>
        <meta name="description" content="Verify your email address for Asap. Enter the OTP sent to your email to confirm your identity and continue using Asap." />
        <link rel="canonical" href={`${window.location.origin}/auth/verification`} />
    </Helmet>

    <section className="flex flex-col gap-y-6">
      <div className="flex flex-col gap-y-4">
        <h4 className="text-4xl text-fluid-h4 font-bold">
          Verify your email address
        </h4>
        <p className="text-lg text-fluid-p">You'll receive an otp on <span className="font-semibold">{user?.email}</span>  that will help us verify that this email is yours</p>
      </div>

      <div>
        {isSuccess ? <OtpVerficationForm/> : <Button disabled={isLoading} onClick={handleSendOtp} type="submit" className="px-6 py-2 rounded-sm max-sm:w-full">Send OTP</Button>}
      </div>
    </section>

    </>
  )
}

export default VerificationPage
