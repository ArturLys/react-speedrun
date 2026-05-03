'use client'

import { useEffect, useState } from 'react'
import Gameboard from './Gameboard'
import Lobby from './Lobby'
import { useGame } from './hooks/useGame'
import { useOnlineGame } from './hooks/useOnlineGame'
import useSocket from '../hooks/useSocket'
import clsx from 'clsx'

export default function UltimateTicTacToe() {
  const [view, setView] = useState<'lobby' | 'game' | 'waiting'>('lobby')
  const [isOnline, setIsOnline] = useState(false)
  const [roomId, setRoomId] = useState<string | null>(null)
  const [player, setPlayer] = useState<'X' | 'O' | null>(null)

  const socket = useSocket()

  // --- FIX: Call both hooks unconditionally at the top level ---
  const onlineGame = useOnlineGame(socket, roomId)
  const localGame = useGame()

  // --- Use a regular variable to select the active game logic ---
  const game = isOnline ? onlineGame : localGame

  // --- Handler functions for the Lobby ---
  function handleCreateRoom() {
    if (!socket) return
    setIsOnline(true)
    socket.emit('createRoom', (roomId: string) => {
      setRoomId(roomId)
      setPlayer('X')
      setView('waiting')
    })
  }

  function handleJoinRoom(roomId: string) {
    if (!socket) return
    setIsOnline(true)
    socket.emit('joinRoom', roomId, (ok: boolean, msg?: string) => {
      if (!ok) {
        setIsOnline(false)
        return alert(msg)
      }
      setRoomId(roomId)
      setPlayer('O')
      setView('waiting')
    })
  }

  useEffect(() => {
    if (!socket) return

    socket.on('gameStart', () => {
      setView('game')
    })

    socket.on('opponentLeft', (message) => {
      alert(message)
      setIsOnline(false)
      setRoomId(null)
      setPlayer(null)
      setView('lobby')
    })

    return () => {
      socket.off('gameStart')
      socket.off('opponentLeft')
    }
  }, [socket])

  function handlePlayLocally() {
    setIsOnline(false) // Ensure isOnline is false for local games
    setView('game')
  }

  if (view === 'lobby') {
    return <Lobby onCreateRoom={handleCreateRoom} onJoinRoom={handleJoinRoom} onPlayLocally={handlePlayLocally} />
  }

  // The rest of your component remains the same and will work correctly
  return (
    <main className='flex flex-col items-center gap-4 p-8 min-h-screen justify-center'>
      {isOnline && view !== 'waiting' && (
        <div>
          You're playing as: <span className={`font-bold text-${player === 'X' ? 'blue' : 'red'}-500 text-xl`}>{player}</span>
        </div>
      )}

      {view !== 'waiting' ? (
        <>
          <Gameboard
            fullBoard={game.fullBoard}
            metaBoard={game.metaBoard}
            activeBoard={game.activeBoard}
            gameState={game.gameState}
            turn={game.turn}
            isYourTurn={isOnline ? player === game.turn : true}
            onCellClick={game.handleCellClick}
            onResetGame={game.resetGame}
          />

          <div className='text-center mt-4'>
            {game.gameState !== 'in-progress' ? (
              <>
                <div className='text-2xl font-bold mb-2'>
                  {game.gameState === 'draw' ? "It's a draw" : game.gameState === 'win' ? 'X wins!' : 'O wins!'}
                </div>
                <button onClick={game.resetGame} className='btn'>
                  Play Again
                </button>
              </>
            ) : (
              <div className='text-2xl font-bold mb-2'>
                {isOnline ? (
                  player === game.turn ? (
                    'Your turn'
                  ) : (
                    "Opponent's turn"
                  )
                ) : (
                  <>
                    <span className={clsx({ 'text-blue-500': game.turn === 'X', 'text-red-500': game.turn === 'O' })}>{game.turn}</span>
                    's turn
                  </>
                )}
              </div>
            )}
          </div>
        </>
      ) : (
        <div className='flex flex-col items-center gap-2'>
          <div>
            Room ID: <span className='font-bold ml-2'>{roomId}</span>
          </div>
          <div className='text-xl'>Waiting for opponent...</div>
        </div>
      )}
    </main>
  )
}
