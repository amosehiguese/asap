import { Bot, BriefcaseMedicalIcon, Layers, SquareUser } from 'lucide-react'
import { NavLink, Link, Outlet } from 'react-router-dom'
import { Tooltip, TooltipContent, TooltipTrigger } from '../components/ui/tooltip'
import { Button } from '../components/ui/button'
import { MoodToggle } from '../components/dashboard'

const DashboardLayout = () => {
  return (
    <div className="grid h-screen w-full pl-[56px]">
      <aside className="inset-y fixed  left-0 z-20 flex h-full flex-col border-r">

        <div className="border-b p-2">
          <Link to='/'>
            <Button variant="outline" size="icon" aria-label="Home">
              <BriefcaseMedicalIcon className="w-6 h-6 transition-all group-hover:scale-110"/>
            </Button>
          </Link>
        </div>

        <nav className='grid gap-1 p-2'>
          <Tooltip>
            <TooltipTrigger asChild>
              <NavLink to='/dashboard'>
                <Button variant='ghost' size='icon' className='rounded-lg'>
                  <Bot className='h-6 w-6'/>
                  <span className='sr-only'>Sypmtom Checker</span>
                </Button>
              </NavLink>
            </TooltipTrigger>
            <TooltipContent side='right' sideOffset={10}>Symptom Checker</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <NavLink to='/dashboard/diagnosis'>
                <Button variant='ghost' size='icon' className='rounded-lg'>
                  <Layers className='h-6 w-6'/>
                  <span className='sr-only'>Diagnosis</span>
                </Button>
              </NavLink>
            </TooltipTrigger>
            <TooltipContent side='right' sideOffset={10}>Diagnosis</TooltipContent>
          </Tooltip>
        </nav>
        <nav className='mt-auto grid gap-1 p-2'>
          <MoodToggle/>

          <Tooltip>
            <TooltipTrigger>
              <Link to='/profile'>
                <Button variant='ghost' size='icon' className='rounded-lg'>
                  <SquareUser className='h-6 w-6'/>
                  <span className='sr-only'>Profile</span>
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent side='right' sideOffset={10}>Profile</TooltipContent>
          </Tooltip>

        </nav>
      </aside>

      <Outlet/>


    </div>
  )
}

export default DashboardLayout
