import { Board, MetaBoard, Player } from './types'

// Creates a single 3x3 board instance.
export const createInitialBoard = (): Board =>
  Array(3)
    .fill(null)
    .map(() => Array(3).fill(null))

// Creates the full 9x9 grid with unique small boards.
export const createFullInitialBoard = (): Board[][] =>
  Array(3)
    .fill(null)
    .map(() =>
      Array(3)
        .fill(null)
        .map(() => createInitialBoard())
    )

// Calculates the winner of any given 3x3 board.
export function calculateWinner(board: (Player | null | 'draw')[][]): Player | null {
  const lines = [
    ...board, // Rows
    [board[0][0], board[1][1], board[2][2]], // Diagonal
    [board[0][2], board[1][1], board[2][0]], // Anti-diagonal
    ...[0, 1, 2].map((c) => [board[0][c], board[1][c], board[2][c]]), // Columns
  ]

  for (const line of lines) {
    if (line[0] && line[0] !== 'draw' && line.every((cell) => cell === line[0])) {
      return line[0]
    }
  }

  return null
}
