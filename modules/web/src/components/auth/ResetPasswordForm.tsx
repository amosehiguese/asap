import { zodResolver } from "@hookform/resolvers/zod"
import { resetPasswordSchema, resetPasswordSchemaType } from "../../schemas"
import { FormInput, SubmitButton } from "../common"
import { useForm, SubmitHandler } from "react-hook-form"
import { useResetPassword } from "../../hooks/useResetPassword"

type PropTypes = {
  token: string,
  email: string,
}

const ResetPasswordForm = ({token, email}: PropTypes) => {
  const {register, handleSubmit, formState: { errors }} = useForm<resetPasswordSchemaType>({
    resolver: zodResolver(resetPasswordSchema)
  })
  const { resetPassword, isLoading }  = useResetPassword()
  const onSubmit: SubmitHandler<resetPasswordSchemaType> = ({newPassword}) => {
    resetPassword({newPassword, token, email: email})
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
      <FormInput
        type="password"
        placeholder="New password"
        register={{...register("newPassword")}}
        error={errors.newPassword?.message}
      />

      <FormInput
        type="password"
        placeholder="Confirm new password"
        register={{...register("confirmPassword")}}
        error={errors.confirmPassword?.message}
      />

      <SubmitButton
        disabled={isLoading}
        className="px-6 py-2 rounded-sm"
        btnText="Update password"
      />

    </form>
  )
}

export default ResetPasswordForm
