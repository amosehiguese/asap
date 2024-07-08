import { Outlet } from 'react-router-dom'
import { Navbar } from '../components'

const HomeLayout = () => {
  return (
    <div className='h-screen'>
      <Navbar/>
      <div className="align-element py-10">
      <Outlet/>
      </div>
    </div>
  )
}

export default HomeLayout
