import { Outlet } from "react-router-dom"
import { AppBranding } from "../components"

const AuthLayout = () => {
  return (
    <div className="align-element flex w-screen min-h-screen bg-background text-text max-xl:justify-center ">
      <div className="flex-auto flex justify-between p-4 max-xl:hidden">
        <AppBranding/>
      </div>
        <div className="w-[30rem] h-fit p-8 flex flex-col gap-y-14 shadow-xl my-10">
            <Outlet/>
        </div>
    </div>
  )
}

export default AuthLayout
