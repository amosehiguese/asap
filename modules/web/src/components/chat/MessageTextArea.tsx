import React, { useState } from 'react'
import { SendIcon } from 'lucide-react'
import { Button } from '../ui/button'
import { Textarea } from '../ui/textarea'
import { Label } from '../ui/label'
import { useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useSendNewMessage } from '../../hooks/useSendNewMessage'

const MessageTextArea = () => {
  const [message, setMessage] = useState("")
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const { sendMessage } = useSendNewMessage()

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value)
  }

  const handleSend = () => {
    if (message.trim()) {
      const prompt = message.trim()
      sendMessage(prompt)
      setMessage("")
    }

    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend()
    }

    if (e.key === "Enter" && e.shiftKey) {
      e.preventDefault()
      setMessage((prev) => prev + "\n")
    }
  }

  return (
    <div className='flex-1' >
      <form className='relative overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring'>
        <Label htmlFor='message' className='sr-only'>
          Message
        </Label>
        <AnimatePresence initial={false}>
          <motion.div
            key="input"
            className="w-full relative"
            layout
            initial={{ opacity: 0, scale: 1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1 }}
            transition={{
              opacity: { duration: 0.05 },
              layout: {
                type: "spring",
                bounce: 0.15,
              },
            }}
          >
            <Textarea
              id='message'
              autoComplete='off'
              value={message}
              ref={inputRef}
              onKeyDown={handleKeyPress}
              onChange={handleInputChange}
              placeholder='Type your message here...'
              className='min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0'
            />
            <div className="flex items-center p-3 pt-2">
              {/* <Tooltip>
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
                </Tooltip> */}

              <span className='sr-only'>Send Message</span>
              <Button onClick={handleSend} type='submit' size='sm' className='ml-auto gap-1.5'>
                <SendIcon className=''/>
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </form>
    </div>
  );
}

export default MessageTextArea
