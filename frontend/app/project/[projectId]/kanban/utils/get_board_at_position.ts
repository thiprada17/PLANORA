import { getBoardWidth } from "./get_board_width"

export function getBoardAtPosition(x: number, boardCount: number) {
  const boardWidth = getBoardWidth()
  const index = Math.floor(x / boardWidth)

  if (index < 0) return 0
  if (index >= boardCount) return boardCount - 1

  return index
}
