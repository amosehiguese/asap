import { useNavigation } from "react-router-dom"
import { Button } from "../ui/button";
import  { LoaderCircle } from "lucide-react"
type PropTypes = {
  btnText: string
  disabled?: boolean
  className?: string
}

const SubmitButton = ({btnText, className,disabled=false}: PropTypes) =>{
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';
  return <Button type="submit" disabled={disabled} className={className}>
    {isSubmitting ? (
      <span className="flex">
        <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
        Submitting...
      </span>
    ) : (
      btnText
    )}

  </Button>
}

export default SubmitButton
