export interface Move {
  rowIndex: number
  colIndex: number
  boardIndex: {
    row: number
    col: number
  }
  player: 'X' | 'O'
}

export interface ServerToClientEvents {
  move: (move: Move) => void
  gameStart: () => void
  restartGame: () => void
  opponentLeft: (message: string) => void
}

export interface ClientToServerEvents {
  createRoom: (callback: (roomId: string) => void) => void
  joinRoom: (roomId: string, callback: (success: boolean, message?: string) => void) => void
  restartGame: (roomId: string) => void
  move: (roomId: string, move: Move) => void
}
