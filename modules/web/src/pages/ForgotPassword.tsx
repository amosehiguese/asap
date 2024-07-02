import { Helmet } from "react-helmet-async";
import {
  RedirectLink,
  ForgotPasswordForm
} from "../components/auth";


const ForgotPassword = () => {
  return (
    <>
      {/* Header */}
      <Helmet>
        <title> Forgot Password | Syp</title>
        <meta name="description" content="Reset your Syp password quickly and easily. Receive a reset link if your email is registered with us." />
        <link rel="canonical" href={`${window.location.origin}/auth/forgot-password`} />
      </Helmet>

      {/* Main */}
      <section className="flex flex-col gap-y-6">
        <div className="flex flex-col gap-y-3">
          <h3 className="text-4xl text-fluid-h3 font-bold">Let us help you</h3>
          <p className="text-lg text-fluid-p">You'll receive a password reset link if your email is registered with us</p>
        </div>

        <div>
          <ForgotPasswordForm/>
        </div>

        <RedirectLink
          pageName="Login"
          text="Go back?"
          to="auth/login"
        />

      </section>


    </>
  )
}

export default ForgotPassword
