import React from "react"
import { Input } from "../ui/input"

type PropTypes = {
  name?: string
  register?: any
  error?: any
  placeholder?: string
  type?: "text" | "email" | "password"
  autoComplete?: React.HTMLInputAutoCompleteAttribute
  maxLength?: number
}

const FormInput = ({register, error, placeholder, maxLength, autoComplete="off", type="text", name}:PropTypes) => {
  return <div className="mb-2">
    <Input
      name={name}
      {...register}
      maxLength={maxLength ? maxLength : null}
      autoComplete={autoComplete}
      type={type}
      className="p-3 rounded outline outline-1 outline-secondary-dark text-white bg-background hover:outline-primary"
      placeholder={placeholder}
    />
    {error && <p className="text-red-500" text-sm>{error}</p>}
  </div>
}

export default FormInput
