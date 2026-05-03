import { useState, useEffect, useCallback } from 'react' // Import useCallback
import { GameState, MetaBoard, Player, Board } from '../lib/types'
import { createFullInitialBoard, createInitialBoard, calculateWinner } from '../lib/gameLogic'
import { Socket } from 'socket.io-client'
import { ClientToServerEvents, ServerToClientEvents, Move } from '../../../../shared/socketTypes'

export function useOnlineGame(socket: Socket<ServerToClientEvents, ClientToServerEvents> | null, roomId: string | null) {
  const [gameState, setGameState] = useState<GameState>('in-progress')
  const [activeBoard, setActiveBoard] = useState<{ row: number; col: number } | null>(null)
  const [metaBoard, setMetaBoard] = useState<MetaBoard>(createInitialBoard())
  const [fullBoard, setFullBoard] = useState<Board[][]>(createFullInitialBoard())
  const [turn, setTurn] = useState<Player>('X')

  // Wrap updateGameState in useCallback
  // This function will now only be recreated if `fullBoard` or `metaBoard` changes.
  const updateGameState = useCallback(
    (move: Move) => {
      const { rowIndex, colIndex, boardIndex, player } = move

      // Use the functional update form of setState to ensure you're working with the latest state
      setFullBoard((currentFullBoard) => {
        const newSmallBoard = currentFullBoard[boardIndex.row][boardIndex.col].map((row, rIndex) =>
          row.map((cell, cIndex) => (rIndex === rowIndex && cIndex === colIndex ? player : cell))
        )
        const newFullBoard = currentFullBoard.map((row) => [...row])
        newFullBoard[boardIndex.row][boardIndex.col] = newSmallBoard
        return newFullBoard
      })

      setMetaBoard((currentMetaBoard) => {
        const newSmallBoard = fullBoard[boardIndex.row][boardIndex.col].map((row, rIndex) =>
          row.map((cell, cIndex) => (rIndex === rowIndex && cIndex === colIndex ? player : cell))
        )
        const boardWinner = calculateWinner(newSmallBoard)
        let updatedMetaBoard = currentMetaBoard

        if (boardWinner || newSmallBoard.every((row) => row.every((cell) => cell !== null))) {
          const result = boardWinner || 'draw'
          updatedMetaBoard = currentMetaBoard.map((row, rIndex) =>
            rIndex !== boardIndex.row ? row : row.map((cell, cIndex) => (cIndex === boardIndex.col ? result : cell))
          )
        }
        // We need the updated metaBoard to set the active board correctly
        const targetBoardIsFinished = updatedMetaBoard[rowIndex][colIndex]
        setActiveBoard(targetBoardIsFinished ? null : { row: rowIndex, col: colIndex })

        return updatedMetaBoard
      })

      setTurn(player === 'X' ? 'O' : 'X')
    },
    [fullBoard]
  ) // We only need fullBoard here, as metaBoard updates are derived from it.

  function handleCellClick(rowIndex: number, colIndex: number, boardIndex: { row: number; col: number }): void {
    if (activeBoard && (activeBoard.row !== boardIndex.row || activeBoard.col !== boardIndex.col)) return

    const move: Move = {
      rowIndex,
      colIndex,
      boardIndex,
      player: turn,
    }

    if (socket && roomId) {
      socket.emit('move', roomId, move)
    }
    updateGameState(move)
  }

  // --- useEffect FIXES ---

  // Effect for handling incoming moves
  useEffect(() => {
    if (!socket) return

    // `updateGameState` is now stable thanks to useCallback
    socket.on('move', updateGameState)

    return () => {
      socket.off('move', updateGameState)
    }
    // The dependency array is now much cleaner and more correct.
  }, [socket, updateGameState])

  // Effect for checking the winner
  useEffect(() => {
    const winner = calculateWinner(metaBoard)
    if (winner) {
      setGameState(winner === 'X' ? 'win' : 'lose')
    } else if (metaBoard.every((row) => row.every((cell) => cell !== null))) {
      setGameState('draw')
    }
  }, [metaBoard])

  // Memoize the local reset logic as well
  const localReset = useCallback(() => {
    setFullBoard(createFullInitialBoard())
    setMetaBoard(createInitialBoard())
    setTurn('X')
    setActiveBoard(null)
    setGameState('in-progress')
  }, []) // Empty dependency array as it has no dependencies

  // Effect for handling game restarts
  useEffect(() => {
    if (!socket) return

    socket.on('restartGame', localReset)

    return () => {
      socket.off('restartGame', localReset)
    }
  }, [socket, localReset])

  function resetGame(): void {
    if (socket && roomId) {
      socket.emit('restartGame', roomId)
    }
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
