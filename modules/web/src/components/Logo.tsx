import { Link } from "react-router-dom";
import { BriefcaseMedicalIcon } from "lucide-react";

type PropsType = {
  hidden: boolean
  sm?: boolean
}

const Logo = ({hidden, sm}: PropsType) => {
  return (
    <Link to="/" className={`flex justify-center items-center p-2 rounded-none text-white ${hidden ? ( sm ? 'lg:hidden w-full pt-8' :'hidden') : ''}`}>
      <div className="bg-primary rounded-lg p-1">
        <BriefcaseMedicalIcon className="w-8 h-8"/>
      </div>
      <p className="ml-2 text-3xl font-bold uppercase text-primary">Asap</p>
    </Link>
  )
}

export default Logo
