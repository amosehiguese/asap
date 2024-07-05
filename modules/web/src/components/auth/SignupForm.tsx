import { zodResolver } from "@hookform/resolvers/zod"
import { SubmitHandler, useForm } from "react-hook-form"
import { useSignup } from "../../hooks/useSignup"
import { useUpdateLogin } from "../../hooks/useUpdateLogin"
import { signupSchema, signupSchemaType } from "../../schemas"
import { FormInput, SubmitButton } from "../common"
import RedirectLink from "./RedirectLink"


const SignupForm = () => {
  const { signup, isSuccess, data, isLoading } = useSignup()
  useUpdateLogin(isSuccess, data)

  const { register, handleSubmit, formState: {errors}} = useForm<signupSchemaType>({
    resolver: zodResolver(signupSchema)
  })

  const onSubmit: SubmitHandler<signupSchemaType> = (data) => {
    const { confirmPassword, ...credentials } = data
    signup(credentials)
  }

  return (
    <form className="flex flex-col gap-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-y-4">
          <div className="flex flex-col gap-y-1">
            <FormInput
              name="firstname"
              autoComplete="firstname webauth"
              placeholder="Firstname"
              register={register("firstname")}
              error={errors.firstname?.message}
            />
          </div>

          <div className="flex flex-col gap-y-1">
            <FormInput
              name="lastname"
              autoComplete="lastname webauth"
              placeholder="Lastname"
              register={register("lastname")}
              error={errors.lastname?.message}
            />
          </div>

          <div className="flex flex-col gap-y-1">
            <FormInput
              name="email"
              autoComplete="email"
              placeholder="Email"
              register={register("email")}
              error={errors.email?.message}
            />
          </div>

          <div className="flex flex-col gap-y-1">
            <FormInput
              name="password"
              autoComplete="password"
              placeholder="Password"
              register={register("password")}
              error={errors.password?.message}
            />
          </div>
          <div className="flex flex-col gap-y-1">
            <FormInput
              name="confirmpassword"
              autoComplete="password"
              placeholder="Confirm Password"
              register={register("confirmPassword")}
              error={errors.confirmPassword?.message}
            />
          </div>
        </div>

        <div className="flex flex-col gap-y-6">
          <div className="flex flex-col gap-y-2">
            <SubmitButton
              btnText="Signup"
              disabled={isLoading}
              className="w-full bg-primary text-white px-6 py-3 rounded shadow-lg font-medium"
            />
          </div>
          <RedirectLink
            pageName="login"
            text="Already a member?"
            to="auth/login"
          />
        </div>

    </form>
  )
}

export default SignupForm
