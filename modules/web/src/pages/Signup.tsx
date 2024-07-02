import { Helmet } from "react-helmet-async"
import { SignupForm } from "../components/auth"

const Signup = () => {
  return (

    <>
      <Helmet>
        <title>Signup | Syp</title>
        <meta name="description" content="Signup to Syp, your AI-based symptom checker." />
        <link rel="canonical" href={`${window.location.origin}/auth/signup`} />
      </Helmet>

      <div className="flex flex-col gap-y-8">
        <div className="text-4xl font-bold text-fluid-h4">Signup</div>
      </div>

      <SignupForm/>
    </>
  )
}

export default Signup
