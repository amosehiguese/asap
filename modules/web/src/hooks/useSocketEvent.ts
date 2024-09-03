import { useEffect } from  "react";
import { Events } from "../enums/events"
import { getSocket } from "../context/socket"

export const useSocketEvent = (eventName: Events, cb: any) => {
  const socket = getSocket()

  useEffect(()=>{
    if(socket){
      socket.on(eventName, cb)
    }

    return ()=> {
      socket?.off(eventName, cb)
    }
  }, [socket])
}
