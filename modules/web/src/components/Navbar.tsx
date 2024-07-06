import { LinksDropDown, Logo, NavLinks } from "."
import { Link } from "react-router-dom"
import { useAppSelector } from "../hooks/useAppSelector"
import { Button } from "./ui/button"

const Navbar = () => {
  const user = useAppSelector((state) => state.userState.loggedUser)

  return (
    <nav className="bg-transparent py-4">
      <div className="align-element flex justify-between items-center">
        <Logo hidden={false} sm={true} />
        <LinksDropDown/>
        <NavLinks/>
        <div className="hidden lg:flex justify-center items-center gap-x-4">
          {
          user ? (
            <Button asChild size="sm" className="rounded-lg">
              <Link to="/dashboard" className="tracking-wider capitalize text-xl">Go To Dashboard</Link>
            </Button>
          ): (
            <div className='flex gap-x-6 justify-center items-center -mr-4'>
            <Button asChild variant='ghost' size='sm' className="rounded-lg">
              <Link to='/auth/login' className="tracking-wider capitalize text-xl">Sign in</Link>
            </Button>

            <Button asChild size='sm' className="rounded-lg">
              <Link to='/auth/signup' className="tracking-wider capitalize text-xl">Sign up</Link>
            </Button>
          </div>
          )
        }
        </div>
      </div>

    </nav>
  )
}

export default Navbar
