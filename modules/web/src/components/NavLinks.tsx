import { NavLink } from "react-router-dom"
import { links } from "../utils/links"

const NavLinks = () => {

  return (
    <div className="hidden lg:flex justify-center items-center gap-x-4">
      {
        links.map((link)=>{
          return (
            <NavLink
              to={link.href}
              key={link.label}
              className={({isActive}) => {
                return `uppercase text-xl font-light tracking-wider ${isActive} ? 'text-primary'`
              }}
            >
              {link.label}
            </NavLink>
          )
        })
      }

    </div>
  )
}

export default NavLinks
