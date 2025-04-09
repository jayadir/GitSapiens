"use client"
import React, { useEffect, useMemo } from 'react'
import { getSocket } from '../lib/socket.config'
import { Button } from './ui/button'
export default function GroupChat() {
    let socket=useMemo(()=>{
        const socket=getSocket()
        return socket.connect()
    },[])
    useEffect(()=>{
        socket.on("message", (message) => {
            console.log("Message received:", message);
        })
        return ()=>{
            socket.close()
        }
    },[])
    const handleClick=()=>{
        socket.emit("message", {
            message: "Hello from client"+Math.random(),
            senderId: "12345",
            groupId: "67890"
        })
    }
  return (
    <div>
      <Button onClick={handleClick}>send</Button>
    </div>
  )
}
