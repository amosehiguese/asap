import React, { createContext,useContext,useMemo, useState, useEffect } from "react";
import io, { Socket } from "socket.io-client";
import { config } from "../config/env"
import { useAppSelector } from "../hooks/useAppSelector"
import { AuthUser } from "../features/user/userSlice"

type SocketState = Socket | null

const socketContext = createContext<SocketState>(null);

type PropTypes = {
  children: React.ReactNode;
}



export const getSocket = () => useContext(socketContext);

let socket: SocketState =  null

export const SocketProvider = ({ children }: PropTypes) => {
  const authUser = useAppSelector(AuthUser);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(()=>{
    if (authUser && !socket) {
      socket = io(config.aiUrl,  {
        withCredentials: true,
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 1000,
      })

      socket.on("connect", () =>{
        setIsConnected(true);
      })

      socket.on("disconnect", () => {
        setIsConnected(false);
      })

      socket.on("connect_error", (error) => {
        console.error("Socket connection error: ", error)
      })

      return () => {
        socket?.disconnect();
        socket = null;
      };
    }

  }, [authUser?.email])

  const socketValue = useMemo(() => socket, [isConnected])

  return (
    <socketContext.Provider value={socketValue}>
      {children}
    </socketContext.Provider>
  )
}

