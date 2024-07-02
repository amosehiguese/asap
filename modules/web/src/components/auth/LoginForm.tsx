import { zodResolver } from "@hookform/resolvers/zod"
import { SubmitHandler, useForm } from "react-hook-form"
import { useUpdateLogin } from "../../hooks/useUpdateLogin"
import { loginSchema, loginSchemaType } from "../../schemas"
import { FormInput, SubmitButton } from "../common"
import RedirectLink from "./RedirectLink"
import { useLogin } from "../../hooks/useLogin"

const LoginForm = () => {
  const {login, data, isLoading, isSuccess} = useLogin()
  useUpdateLogin(isSuccess, data)

  const { register, handleSubmit, formState: { errors }} = useForm<loginSchemaType>({
    resolver: zodResolver(loginSchema)
  })

  const onSubmit: SubmitHandler<loginSchemaType> = (data) => login(data)

  return (
    <form className="flex flex-col gap-y-6" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-y-4">
        <div className="flex flex-col gap-y-1">
          <FormInput
            autoComplete="email webauth"
            placeholder="Email"
            register={register("email")}
            error={errors.email?.message}
          />
        </div>

        <div className="flex flex-col gap-y-1">
          <FormInput
            autoComplete="current-password webauth"
            type="password"
            placeholder="Password"
            register={register("password")}
            error={errors.password?.message}
          />
        </div>
      </div>

      <div className="flex flex-col gap-y-6">
        <div className="flex flex-col gap-y-6">
          <SubmitButton
            disabled={isLoading}
            btnText="Login"
            className="w-full bg-primary text-white px-6 py-3 rounded shadow-lg font-medium"
          />
        </div>

        <div className="flex justify-between items-center flex-wrap gap-1">
          <RedirectLink
            pageName="signup"
            text="Already a member?"
            to="auth/signup"
          />
          <RedirectLink
            pageName="forgot password"
            text="Need Help?"
            to="auth/forgot-password"
          />
        </div>

      </div>

    </form>
  )
}

export default LoginForm
