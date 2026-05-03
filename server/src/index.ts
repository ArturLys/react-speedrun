// server.ts
import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import { generateRoomId } from './utils'
// Assuming you have this from previous steps for type safety
import { ClientToServerEvents, ServerToClientEvents } from './shared/socketTypes'

const app = express()
const server = http.createServer(app)
const io = new Server<ClientToServerEvents, ServerToClientEvents>(server, {
  cors: { origin: '*' },
})

const rooms: Record<string, string[]> = {}
// --- NEW: Add a mapping from a socket's ID to their room ID ---
// This makes cleanup on disconnect much faster and easier.
const socketIdToRoomId: Record<string, string> = {}

io.on('connection', (socket) => {
  console.log('🔌:', socket.id)

  // The 'disconnect' event is the key to handling a user leaving.
  socket.on('disconnect', () => {
    console.log('❌:', socket.id)

    // Step 1: Find which room the disconnected user was in.
    const roomId = socketIdToRoomId[socket.id]
    if (roomId && rooms[roomId]) {
      console.log(`Player ${socket.id} is leaving room ${roomId}`)

      // Step 2: Find and notify the other player in the room.
      const otherPlayerSocketId = rooms[roomId].find((id) => id !== socket.id)
      if (otherPlayerSocketId) {
        // Emit a specific event to the other player so their UI can react.
        io.to(otherPlayerSocketId).emit('opponentLeft', 'Opponent has disconnected.')
        io.to(roomId).emit('restartGame')
        // Clean up the other player's room mapping.
        delete socketIdToRoomId[otherPlayerSocketId]
      }

      // Step 3: Clean up the server state by deleting the room.
      delete rooms[roomId]
      delete socketIdToRoomId[socket.id]
      console.log(`Room ${roomId} has been deleted.`)
    }
  })

  socket.on('createRoom', (callback) => {
    const roomId = generateRoomId()
    socket.join(roomId)
    rooms[roomId] = [socket.id]

    // --- UPDATE: Map the socket ID to the new room ID ---
    socketIdToRoomId[socket.id] = roomId

    callback(roomId)
    console.log(`Player ${socket.id} created and joined room ${roomId}`)
  })

  socket.on('joinRoom', (roomId, callback) => {
    if (!rooms[roomId]) return callback(false, 'Room not found')
    if (rooms[roomId].length >= 2) return callback(false, 'Room full')

    socket.join(roomId)
    rooms[roomId].push(socket.id)

    // --- UPDATE: Map the joining socket ID to the room ID ---
    socketIdToRoomId[socket.id] = roomId

    callback(true)

    // The game starts when the second player joins.
    io.to(roomId).emit('gameStart')
    console.log(`Player ${socket.id} joined room ${roomId}`)
  })

  socket.on('move', (roomId, move) => {
    if (!rooms[roomId]) return
    socket.to(roomId).emit('move', move)
  })

  socket.on('restartGame', (roomId) => {
    if (!rooms[roomId]) return
    io.to(roomId).emit('restartGame')
  })
})

const PORT = Number(process.env.PORT) || 4000
server.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ server listening on port ${PORT}`)
})

export default app
