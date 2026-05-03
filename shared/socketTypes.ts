export interface Move {
  rowIndex: number
  colIndex: number
  boardIndex: {
    row: number
    col: number
  }
  player: 'X' | 'O'
}

// Events sent from the server to the client
export interface ServerToClientEvents {
  move: (move: Move) => void
  gameStart: () => void // Added from the previous server example
  restartGame: () => void
  opponentLeft: (message: string) => void
}

// Events sent from the client to the server
export interface ClientToServerEvents {
  createRoom: (callback: (roomId: string) => void) => void
  joinRoom: (roomId: string, callback: (success: boolean, message?: string) => void) => void
  restartGame: (roomId: string) => void
  move: (roomId: string, move: Move) => void
}
