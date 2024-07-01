import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { forgotPasswordSchema, forgotPasswordSchemaType } from "../schemas"


const ForgotPasswordForm = () => {
  const { register , handleSubmit, formState: {errors}, setValue} = useForm<forgotPasswordSchemaType>({
    resolver: zodResolver(forgotPasswordSchema)
  })
  return (
    <div>

    </div>
  )
}

export default ForgotPasswordForm
