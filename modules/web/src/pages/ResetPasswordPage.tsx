import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation, useNavigate } from "react-router-dom";
import { ResetPasswordForm } from "../components/auth";


const ResetPasswordPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const token = queryParams.get('token')
  const email = queryParams.get('email')

  useEffect(()=>{
    if(!token || !email) {
      navigate("/auth/login")
    }
  }, [token, email])

  return (
    <>
      <Helmet>
      <title>Reset Password | Asap</title>
        <meta name="description" content="Reset your password to regain access to your Syp account." />
        <link rel="canonical" href={`${window.location.origin}/auth/reset-password?token=${token}&user=${email}`} />
      </Helmet>

      <div className="flex flex-col gap-y-6">
        <div className="flex flex-col gap-y-3">
          <h3 className="text-4xl text-fluid-h3 font-bold">Reset your password</h3>
          <p className="text-lg text-fluid-p">Once your password is reset you can login with your new password</p>
        </div>

        <div>
          {token && email && <ResetPasswordForm token={token} email={email}/>}
        </div>
      </div>

    </>
  )
}

export default ResetPasswordPage
