import { useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { ClientToServerEvents, ServerToClientEvents } from '../../../shared/socketTypes'

export default function useSocket(): Socket<ServerToClientEvents, ClientToServerEvents> | null {
  const [socket, setSocket] = useState<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null)

  useEffect(() => {
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4000'
    const s: Socket<ServerToClientEvents, ClientToServerEvents> = io(socketUrl, {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    })

    setSocket(s)

    s.on('connect', () => console.log('✅ connected:', s.id))
    s.on('disconnect', (reason) => console.log('❌ disconnected:', reason))

    return () => {
      s.disconnect()
      console.log('Socket disconnected (cleanup)')
    }
  }, [])

  return socket
}
