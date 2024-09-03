import { Sender } from "../../enums"
import BotImage from "../BotImage"
import { useEffect, useRef } from "react"
import { IMessage } from "../../interfaces"
import { AnimatePresence, motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import {dark} from 'react-syntax-highlighter/dist/esm/styles/prism'
import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"


type PropTypes = {
  messages?: IMessage[]
}

const Messages = ({ messages }: PropTypes ) => {
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(()=>{
    if(messagesContainerRef.current){
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
    }
  },[messages])

  return (
    <div className="relative w-full overflow-y-auto overflow-x-hidden h-5/6 flex flex-col">
      <div
        ref={messagesContainerRef}
        className="absolute w-full overflow-auto overflow-x-hidden h-full flex flex-col"
      >
        <AnimatePresence>
          {messages?.map((message, index) => (
            <motion.div
              key={index}
              layout
              initial={{ opacity: 0, scale: 1, y: 50, x: 0 }}
              animate={{ opacity: 1, scale: 1, y: 0, x: 0}}
              exit={{ opacity: 0, scale: 1, y:1, x: 0}}
              transition={{
                opacity: { duration: 0.1 },
                layout: {
                  type: "spring",
                  bounce: 0.3,
                  duration: messages.indexOf(message) * 0.05 + 0.2,
                },
              }}
              style={{
                originX: 0.5,
                originY: 0.5,
              }}

              className={message.sender !== Sender.User ? "flex flex-col gap-2 p-4 whitespace-pre-wrap items-start" : "flex flex-col gap-2 p-4 whitespace-pre-wrap items-end"}
            >
              <div className="flex gap-3 items-start">
                {(message.sender !== Sender.User ) && (
                  <BotImage/>
                )}

                <Markdown
                    children={message.content}
                    className="bg-accent p-3 rounded-md max-w-xl"
                    components={{
                      code(props) {
                        const {children, className, node, ...rest} = props
                        const match = /language-(\w+)/.exec(className || '')
                        return match ? (
                          <SyntaxHighlighter
                            PreTag="div"
                            children={String(children).replace(/\n$/, '')}
                            language={match[1]}
                            style={dark}
                          />
                        ) : (
                          <code {...rest} className={className}>
                            {children}
                          </code>
                        )
                      }
                    }}
                  />

                  {/* <Markdown className="bg-accent p-3 rounded-md max-w-xl" remarkPlugins={[remarkGfm]}>
                    {message.content}
                  </Markdown> */}

                {(message.sender === Sender.User) && (
                  <Avatar className="flex justify-center items-start rounded-lg">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default Messages
