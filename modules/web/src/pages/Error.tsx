import { Helmet } from "react-helmet-async";
import { NavLink } from "react-router-dom";
import { SubmitButton } from "../components/common";


const Error = () => {
  return (
    <>
      {/* Header */}
      <Helmet>
      <title>Page Not Found | Syp</title>
        <meta name="description" content="Oops! The page you're looking for doesn't exist. Return to home" />
        <link rel="canonical" href={`${window.location.origin}${location.pathname}`} />
      </Helmet>

      {/* Main */}
      <section className="bg-background w-screen h-screen p-4 flex justify-center">
        <div className="h-fit justify-center flex mt-36 flex-col gap-y-10 rounded-sm items-center">
          <h4 className="text-text text-7xl font-extrabold">404</h4>
          <h4 className="text-text font-medium text-5xl">Ohh! looks like you landed on a wrong page 😺</h4>
        </div>

        <NavLink
          to={"/"}
        >
          <SubmitButton
            btnText="Home"
            className="text-text text-xl bg-secondary-dark px-6 py-2 rounded-md"
          />
        </NavLink>
      </section>
    </>
  )
}

export default Error
