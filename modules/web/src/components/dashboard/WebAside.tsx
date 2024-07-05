import { Tooltip, TooltipTrigger, TooltipContent } from "@radix-ui/react-tooltip"
import { BriefcaseMedicalIcon, Home, Bot, Layers, Settings } from "lucide-react"
import { Link } from "react-router-dom"

const WebAside = () => {
  return (
    <aside className='fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex'>
      <nav className='flex flex-col items-center gap-4 px-2 sm: py-4'>
        <Link to='/dashboard/home' className='group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base'>
          <BriefcaseMedicalIcon className="w-6 h-6 transition-all group-hover:scale-110"/>
          <span className='sr-only'>Asap</span>
        </Link>
        <Tooltip>
          <TooltipTrigger asChild>
            {/* Todo: add path */}
            <Link to='#' className='flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8'>
              <Home className='h-6 w-6'/>
              <span className='sr-only'>Home</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side='right'>Home</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            {/* Todo: add path */}
            <Link to='#' className='flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8'>
              <Bot className='h-6 w-6'/>
              <span className='sr-only'>Symptom Checker</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side='right'>Symptom Checker</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            {/* Todo: add path */}
            <Link to='#' className='flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8'>
              <Layers className='h-6 w-6'/>
              <span className='sr-only'>Conversations</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side='right'>Conversations</TooltipContent>
        </Tooltip>
      </nav>
      <nav className='mt-auto flex-col items-center gap-4 px-2 sm:py-4'>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link to='/settings' className='flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8'>
              <Settings className='h-6 w-6'/>
            </Link>
          </TooltipTrigger>
        </Tooltip>
      </nav>
    </aside>
  )
}

export default WebAside
