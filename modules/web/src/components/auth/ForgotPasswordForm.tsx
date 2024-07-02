import { SubmitHandler, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { forgotPasswordSchema, forgotPasswordSchemaType } from "../../schemas"
import { useForgotPassword } from "../../hooks/useForgotPassword"
import { FormInput, SubmitButton } from "../common"

const ForgotPasswordForm = () => {
  const { register , handleSubmit, formState: {errors}, setValue} = useForm<forgotPasswordSchemaType>({
    resolver: zodResolver(forgotPasswordSchema)
  })

  const {forgotPassword} = useForgotPassword()
  const onSubmit: SubmitHandler<forgotPasswordSchemaType> = ({email})=>{
    forgotPassword({email})
    setValue("email", "")
  }


  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
      <FormInput
        autoComplete="email"
        placeholder="email"
        register={{...register("email")}}
        error={errors.email?.message}
      />
      <SubmitButton btnText="Send reset link" className="w-full bg-primary text-white px-6 py-3 rounded shadow-lg font-medium" />
    </form>
  )
}

export default ForgotPasswordForm
