import { Helmet } from "react-helmet-async";
import { useRouteError, isRouteErrorResponse } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { SubmitButton } from "../components/common";


const Error = () => {
  const error = useRouteError()

  if (isRouteErrorResponse(error) && error.status === 404) {
      return <>
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

          <NavLink to={"/"}>
            <SubmitButton
              btnText="Home"
              className="text-text text-xl bg-secondary px-6 py-2 rounded-md"
            />
          </NavLink>
        </section>
      </>
  }

  return <>
    {/* Header */}
    <Helmet>
    <title>An error occurred | Syp</title>
      <meta name="description" content="Oops! An error occurred." />
      <link rel="canonical" href={`${window.location.origin}${location.pathname}`} />
    </Helmet>

    <section className='bg-background w-screen h-screen p-4 grid place-items-center'>
      {/* Todo */}
      {/* fill with an emoji */}
      <h4 className='text-center font-bold text-5xl'>there was an error...</h4>
    </section>

  </>
}

export default Error
