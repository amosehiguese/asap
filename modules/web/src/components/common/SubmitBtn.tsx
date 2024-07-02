import { useNavigation } from "react-router-dom"


type PropTypes = {
  btnText: string
  disabled?: boolean
}

export const SubmitButton = ({btnText, disabled=false}: PropTypes) =>{
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';
  return <></>
}
