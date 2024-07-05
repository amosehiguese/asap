import { Mic, Paperclip, SendIcon } from 'lucide-react'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import HeroImg from '../HeroImg'

const ChatBody = () => {
  return (
    <main className='grid flex-1 gap-4 overflow-auto p-4 md:grid-cols-2 lg:grid-cols-3'>
      <div className="relative hidden flex-col justify-center gap-8 md:flex">
        <HeroImg/>
      </div>

      <div className="relative flex h-full min-h-[50vh] flex-col rounded-xl bg-muted/50 p-4 lg:col-span-2">
        <Badge variant='outline' className='absolute right-3 top-3'>
          Output
        </Badge>
        <div className='flex-1' />
          <form className='relative overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring'>
            <Label htmlFor='message' className='sr-only'>
              Message
            </Label>
            <Textarea
              id='message'
              placeholder='Type your message here...'
              className='min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0'
            />
            <div className="flex items-center p-3 pt-0">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant='ghost' size='icon'>
                    <Paperclip className='size-4'/>
                    <span className='sr-only'>Attach file</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side='top'>Attach File</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant='ghost' size='icon'>
                    <Mic className='size-4'/>
                    <span className='sr-only'>Use Microphone</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side='top'>Use Microphone</TooltipContent>
              </Tooltip>

              <Button type='submit' size='sm' className='ml-auto gap-1.5'>
                <SendIcon className=''/>
                <span className='sr-only'>Send Message</span>
              </Button>
            </div>
          </form>
        </div>
    </main>
  )
}

export default ChatBody
