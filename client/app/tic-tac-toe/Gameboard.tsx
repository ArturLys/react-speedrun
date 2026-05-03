import clsx from 'clsx'
import { GameState, MetaBoard, Player, Board } from './lib/types'
import SmallBoard from './SmallBoard'

// 1. Define the props the component will receive from its parent.
// These are all the states and functions it needs to render correctly.
type GameboardProps = {
  fullBoard: Board[][]
  metaBoard: MetaBoard
  activeBoard: { row: number; col: number } | null
  gameState: GameState
  turn: Player
  isYourTurn: boolean
  onCellClick: (rowIndex: number, colIndex: number, boardIndex: { row: number; col: number }) => void
  onResetGame: () => void
}

// 2. Create the component. It's clean because it only cares about rendering.
export default function Gameboard({ fullBoard, metaBoard, activeBoard, gameState, turn, isYourTurn, onCellClick, onResetGame }: GameboardProps) {
  // 3. The entire <main> block is moved here from your original file.
  return (
    <div>
      {/* The Main Game Board */}
      <div className={`grid grid-cols-3 ${!isYourTurn && 'cursor-not-allowed'}`}>
        {fullBoard.map((boardRow, boardRowIndex) =>
          boardRow.map((smallBoard, boardColIndex) => {
            const isActive = activeBoard?.row === boardRowIndex && activeBoard?.col === boardColIndex
            return (
              <SmallBoard
                key={`${boardRowIndex}-${boardColIndex}`}
                smallBoard={smallBoard}
                boardWinner={metaBoard[boardRowIndex][boardColIndex]}
                isActive={isActive}
                isPlayable={!activeBoard || isActive}
                gameState={gameState}
                boardIndex={{ row: boardRowIndex, col: boardColIndex }}
                isYourTurn={isYourTurn}
                // It now calls the function passed down through props
                onCellClick={onCellClick}
              />
            )
          })
        )}
      </div>
    </div>
  )
}
