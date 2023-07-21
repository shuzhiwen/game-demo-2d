import {boardSize} from '@chess/helper'
import {DataTable, robustRange, tableListToTable} from 'awesome-chart'
import {RawTableList} from 'awesome-chart/dist/types'

export function isGobangChessWin(props: {data: RawTableList; position: Vec2}) {
  const {data, position} = props
  const table = new DataTable(tableListToTable(data))

  return (
    isHorizontalWin(table.body, position) ||
    isVerticalWin(table.body, position) ||
    isMainDiagonalWin(table.body, position) ||
    isAntiDiagonalWin(table.body, position)
  )
}

function isHorizontalWin(data: RawTableList, position: Vec2) {
  const [x, y] = position
  const minIndex = Math.max(0, x - 4)
  const maxIndex = Math.min(boardSize, x + 4)

  if (maxIndex - minIndex < 4) return false

  for (let i = minIndex; i <= maxIndex - 4; i++) {
    if (robustRange(i, i + 4).every((tx) => data[tx][y] === data[x][y])) {
      return true
    }
  }

  return false
}

function isVerticalWin(data: RawTableList, position: Vec2) {
  const [x, y] = position
  const minIndex = Math.max(0, y - 4)
  const maxIndex = Math.min(boardSize, y + 4)

  if (maxIndex - minIndex < 4) return false

  for (let i = minIndex; i <= maxIndex - 4; i++) {
    if (robustRange(i, i + 4).every((ty) => data[x][ty] === data[x][y])) {
      return true
    }
  }

  return false
}

function isMainDiagonalWin(data: RawTableList, position: Vec2) {
  const [x, y] = position
  const minIndex = Math.max(Math.max(-x, -4), Math.max(-y, -4))
  const maxIndex = Math.min(Math.min(boardSize - x, 4), Math.min(boardSize - y, 4))

  if (maxIndex - minIndex < 4) return false

  for (let i = minIndex; i <= maxIndex - 4; i++) {
    if (robustRange(i, i + 4).every((tp) => data[x + tp][y + tp] === data[x][y])) {
      return true
    }
  }

  return false
}

function isAntiDiagonalWin(data: RawTableList, position: Vec2) {
  const [x, y] = position
  const minIndex = Math.max(Math.max(-x, -4), Math.max(y - boardSize, -4))
  const maxIndex = Math.min(Math.min(boardSize - x, 4), Math.min(y, 4))

  if (maxIndex - minIndex < 4) return false

  for (let i = minIndex; i <= maxIndex - 4; i++) {
    if (robustRange(i, i + 4).every((tp) => data[x + tp][y - tp] === data[x][y])) {
      return true
    }
  }

  return false
}
