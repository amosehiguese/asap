import { Link } from "react-router-dom"

type PropTypes = {
  to: string,
  pageName: string
  text: string
}

const RedirectLink = ({to, pageName, text}: PropTypes) => {
  return (
    <p className="text-fluid-p">
      {text}
      <span className="text-primary hover:text-primary-dark font-medium cursor-pointer ml-1 text-fluid-p">
        <Link className="text-fluid-p" to={`/${to}`}>
          {pageName}
        </Link>
      </span>
    </p>
  )
}


export default RedirectLink
