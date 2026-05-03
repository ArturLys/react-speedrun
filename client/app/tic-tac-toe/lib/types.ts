export type Player = 'X' | 'O'
export type CellValue = Player | null
export type Board = CellValue[][]

export type MetaBoardValue = Player | 'draw' | null
export type MetaBoard = MetaBoardValue[][]

export type GameState = 'in-progress' | 'draw' | 'win' | 'lose'
