// src/components/SmallBoard.tsx

import clsx from 'clsx'
import { MinusIcon } from '@heroicons/react/24/outline'
import { Board, GameState, MetaBoardValue, Player } from './lib/types'

type SmallBoardProps = {
  smallBoard: Board
  boardWinner: MetaBoardValue
  isActive: boolean
  isPlayable: boolean
  gameState: GameState
  boardIndex: { row: number; col: number }
  isYourTurn: boolean
  onCellClick: (rowIndex: number, colIndex: number, boardIndex: { row: number; col: number }) => void
}

// The getCellClasses function is now co-located with the component that uses it.
function getCellClasses(
  cell: Player | null,
  isPlayable: boolean,
  gameState: GameState,
  rowIndex: number,
  colIndex: number,
  isYourTurn: boolean
): string {
  const isCellPlayable = isPlayable && !cell && gameState === 'in-progress'
  return clsx('w-16 h-16 border flex items-center justify-center text-2xl font-bold transition-colors select-none border-white-t', {
    'text-blue-500': cell === 'X',
    'text-red-500': cell === 'O',
    'cursor-pointer hover:bg-white-t/10': isCellPlayable && isYourTurn,
    'cursor-not-allowed': !isYourTurn,
    'border-t-0': rowIndex === 0,
    'border-b-0': rowIndex === 2,
    'border-l-0': colIndex === 0,
    'border-r-0': colIndex === 2,
  })
}

export default function SmallBoard({
  smallBoard,
  boardWinner,
  isActive,
  isPlayable,
  gameState,
  boardIndex,
  isYourTurn,
  onCellClick,
}: SmallBoardProps) {
  return (
    <div
      className={`relative border-2 p-1 select-none transition-colors ${
        isActive && gameState === 'in-progress' ? 'border-yellow-400' : 'border-gray-700'
      }`}
    >
      {/* Winner Overlay */}
      {boardWinner && (
        <div className='absolute inset-0 z-10 flex items-center justify-center bg-black-t'>
          <span className={`text-9xl font-bold ${boardWinner === 'X' ? 'text-blue-500' : boardWinner === 'O' ? 'text-red-500' : 'text-yellow-500'}`}>
            {boardWinner === 'draw' ? <MinusIcon className='h-36 w-36' strokeWidth={2.7} /> : boardWinner}
          </span>
        </div>
      )}

      {/* Grid of Buttons */}
      <div className='grid grid-cols-3'>
        {smallBoard.map((row, rowIndex) =>
          row.map((cellValue, colIndex) => (
            <button
              key={`${rowIndex}-${colIndex}`}
              className={getCellClasses(cellValue, isPlayable, gameState, rowIndex, colIndex, isYourTurn)}
              disabled={!isPlayable || !!cellValue || !!boardWinner || gameState !== 'in-progress' || !isYourTurn}
              onClick={() => onCellClick(rowIndex, colIndex, boardIndex)}
            >
              {cellValue}
            </button>
          ))
        )}
      </div>
    </div>
  )
}
