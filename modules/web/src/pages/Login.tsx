import { Helmet } from "react-helmet-async";
import {
  LoginForm
} from "../components/auth";


const Login = () => {
  return (
    <>
      {/* Header */}
      <Helmet>
        <title> Login | Asap</title>
        <meta name="description" content="Login to Syp. Your AI-based symptom checker" />
        <link rel="canonical" href={`${window.location.origin}/auth/login`} />
      </Helmet>

      {/* Main */}
      <section className="flex flex-col gap-y-8">
        <h3 className="text-4xl text-fluid-h3 font-bold text-center">Login</h3>
      </section>

      <LoginForm/>
    </>
  )
}

export default Login
