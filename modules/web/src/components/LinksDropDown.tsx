import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { AlignRight } from "lucide-react"
import { Button } from "./ui/button"
import { links } from "../utils/links"
import { Link } from "react-router-dom"
import { useAppSelector } from "../hooks/useAppSelector"


const LinksDropDown = () => {
  const user = useAppSelector((state)=> state.userState.loggedUser)
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="lg:hidden">
        <Button variant="outline" size="icon">
          <AlignRight />
          <span className="sr-only">Toggle Links</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-52 lg:hidden"
        align="start"
        sideOffset={25}
      >
        {links.map((link)=>{
          return (
            <DropdownMenuItem key={link.label}>
              <Link
                to={link.href}
                className='capitalize w-full text-primary'
              >
                {link.label}
              </Link>
            </DropdownMenuItem>
          )
        })}

        <DropdownMenuItem>
          <div className="lg:flex justify-center items-center gap-x-4">
            {
            user ? (
              <Button asChild size="sm" className="rounded-lg">
                <Link to="/dashboard" className="tracking-wider capitalize">Go To Dashboard</Link>
              </Button>
            ): (
              <div className='flex gap-x-6 justify-center items-center -mr-4'>
              <Button asChild size='sm' className="rounded-lg">
                <Link to='/auth/login' className="tracking-wider capitalize text-lg">Sign in</Link>
              </Button>

              <Button asChild size='sm' className="rounded-lg">
                <Link to='/auth/signup' className="tracking-wider capitalize text-lg">Sign up</Link>
              </Button>
            </div>
            )
          }
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>

    </DropdownMenu>
  )
}

export default LinksDropDown
