import { useState, useEffect } from 'react'
import { GameState, MetaBoard, Player, Board } from '../lib/types'
import { createFullInitialBoard, createInitialBoard, calculateWinner } from '../lib/gameLogic'

export function useGame() {
  const [gameState, setGameState] = useState<GameState>('in-progress')
  const [activeBoard, setActiveBoard] = useState<{ row: number; col: number } | null>(null)
  const [metaBoard, setMetaBoard] = useState<MetaBoard>(createInitialBoard())
  const [fullBoard, setFullBoard] = useState<Board[][]>(createFullInitialBoard())
  const [turn, setTurn] = useState<Player>('X')

  function handleCellClick(rowIndex: number, colIndex: number, boardIndex: { row: number; col: number }): void {
    if (activeBoard && (activeBoard.row !== boardIndex.row || activeBoard.col !== boardIndex.col)) return

    const newSmallBoard = fullBoard[boardIndex.row][boardIndex.col].map((row, rIndex) =>
      row.map((cell, cIndex) => (rIndex === rowIndex && cIndex === colIndex ? turn : cell))
    )

    setFullBoard((prev) => {
      const newFullBoard = prev.map((row) => [...row])
      newFullBoard[boardIndex.row][boardIndex.col] = newSmallBoard
      return newFullBoard
    })

    const boardWinner = calculateWinner(newSmallBoard)
    let updatedMetaBoard = metaBoard

    if (boardWinner || newSmallBoard.every((row) => row.every((cell) => cell !== null))) {
      const result = boardWinner || 'draw'
      updatedMetaBoard = metaBoard.map((row, rIndex) =>
        rIndex !== boardIndex.row ? row : row.map((cell, cIndex) => (cIndex === boardIndex.col ? result : cell))
      )
      setMetaBoard(updatedMetaBoard)
    }

    const targetBoardIsFinished = updatedMetaBoard[rowIndex][colIndex]
    setActiveBoard(targetBoardIsFinished ? null : { row: rowIndex, col: colIndex })
    setTurn(turn === 'X' ? 'O' : 'X')
  }

  useEffect(() => {
    const winner = calculateWinner(metaBoard)
    if (winner) {
      setGameState(winner === 'X' ? 'win' : 'lose')
    } else if (metaBoard.every((row) => row.every((cell) => cell !== null))) {
      setGameState('draw')
    }
  }, [metaBoard])

  function resetGame(): void {
    setFullBoard(createFullInitialBoard())
    setMetaBoard(createInitialBoard())
    setTurn('X')
    setActiveBoard(null)
    setGameState('in-progress')
  }

  return {
    gameState,
    activeBoard,
    metaBoard,
    fullBoard,
    turn,
    handleCellClick,
    resetGame,
  }
}
