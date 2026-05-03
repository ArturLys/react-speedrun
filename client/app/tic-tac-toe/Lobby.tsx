import { useState } from 'react'

type LobbyProps = {
  onCreateRoom: () => void
  onJoinRoom: (roomId: string) => void
  onPlayLocally: () => void
}

type ViewMode = 'initial' | 'online'

export default function Lobby({ onCreateRoom, onJoinRoom, onPlayLocally }: LobbyProps) {
  const [joinRoomId, setJoinRoomId] = useState('')
  const [viewMode, setViewMode] = useState<ViewMode>('initial')
  // 1. Add state to hold the validation error message
  const [roomIdError, setRoomIdError] = useState<string | null>(null)

  const handleRoomIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Clear error as soon as the user starts typing again
    if (roomIdError) {
      setRoomIdError(null)
    }
    // 2. Trim the input to a max of 6 characters and convert to uppercase
    const value = e.target.value.toUpperCase().slice(0, 6)
    setJoinRoomId(value)
  }

  const handleJoinRoom = () => {
    // 3. Validate the room ID length before attempting to join
    if (joinRoomId.trim().length < 6) {
      setRoomIdError('Room code must be 6 characters.')
      return
    }
    // If validation passes, clear any previous error and call the prop function
    setRoomIdError(null)
    onJoinRoom(joinRoomId)
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-screen gap-4'>
      {viewMode === 'initial' ? (
        <>
          <button onClick={onPlayLocally} className='btn'>
            Play Locally
          </button>
          <button onClick={() => setViewMode('online')} className='btn'>
            Play Online
          </button>
        </>
      ) : (
        <>
          <div className='flex flex-col gap-2'>
            <button onClick={onCreateRoom} className='btn'>
              Create New Game Room
            </button>
          </div>
          <div className='w-full max-w-xs h-px bg-gray-600 my-4'></div>
          <div className='flex flex-col gap-2 w-full max-w-xs'>
            <input
              type='text'
              placeholder='Enter Room Code'
              value={joinRoomId}
              onChange={handleRoomIdChange}
              className='w-full
                  px-3 py-2
    tracking-widest
    border border-transparent
    rounded-xl
    focus:outline-none
    focus:ring-2 focus:ring-primary
    transition-colors duration-200'
              maxLength={6}
            />
            {roomIdError && <p className='text-red-500 text-sm'>{roomIdError}</p>}
            <button onClick={handleJoinRoom} className='btn mt-2'>
              Join Room
            </button>
          </div>
        </>
      )}
    </div>
  )
}
