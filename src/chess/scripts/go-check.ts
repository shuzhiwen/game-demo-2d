import {Role} from '@chess/helper'
import {DataTable, isRealNumber, safeLoop, tableListToTable} from 'awesome-chart'
import {RawTableList} from 'awesome-chart/dist/types'

interface GoCheckProps {
  data: RawTableList
  position: Vec2
  role: Role
}

export function checkAppendGoChess(props: GoCheckProps) {
  const {data, position, role} = props
  const {rows, columns, body} = new DataTable(tableListToTable(data))
  const [maxRow, maxColumn] = [rows.length, columns.length]
  const visited: Set<number> = new Set()
  const chessPool: Vec2[] = [position]
  let life = 0

  if (
    role === Role.EMPTY ||
    position[0] < 0 ||
    position[0] >= maxRow ||
    position[1] < 0 ||
    position[1] >= maxColumn
  ) {
    return {life, visited}
  }

  safeLoop(
    () => chessPool.length !== 0,
    () => {
      const [row, column] = chessPool.shift()!

      visited.add(row * maxColumn + column)

      if (row > 0 && !visited.has((row - 1) * maxColumn + column)) {
        const top = body[row - 1][column]
        if (top === Role.EMPTY) {
          life++
        } else if (top === role) {
          chessPool.push([row - 1, column])
        }
      }
      if (row < maxRow - 1 && !visited.has((row + 1) * maxColumn + column)) {
        const bottom = body[row + 1][column]
        if (bottom === Role.EMPTY) {
          life++
        } else if (bottom === role) {
          chessPool.push([row + 1, column])
        }
      }
      if (column > 0 && !visited.has(row * maxColumn + column - 1)) {
        const left = body[row][column - 1]
        if (left === Role.EMPTY) {
          life++
        } else if (left === role) {
          chessPool.push([row, column - 1])
        }
      }
      if (column < maxColumn - 1 && !visited.has(row * maxColumn + column + 1)) {
        const right = body[row][column + 1]
        if (right === Role.EMPTY) {
          life++
        } else if (right === role) {
          chessPool.push([row, column + 1])
        }
      }
    }
  )

  return {life, visited}
}

export function checkEatGoChess(props: GoCheckProps) {
  const {data, position, role} = props
  const [row, column] = position

  data.forEach((item) => {
    item[0] === row && item[1] === column && (item[2] = role)
  })

  const table = new DataTable(tableListToTable(data))
  const body = table.body as RawTableList<Role>
  const checkList: Vec2[] = [
    [row - 1, column],
    [row + 1, column],
    [row, column - 1],
    [row, column + 1],
  ]
  const removedChesses = checkList.reduce((removed, position) => {
    const {life, visited} = checkAppendGoChess({
      data,
      position,
      role: body[position[0]]?.[position[1]] ?? Role.EMPTY,
    })
    if (life === 0) {
      Array.from(visited).forEach((item) => removed.add(item))
    }
    return removed
  }, new Set<number>())
  const newBoard = data.map(([row, column, role], index) => {
    if (
      index !== 0 &&
      isRealNumber(row) &&
      isRealNumber(column) &&
      removedChesses.has(row * table.columns.length + column)
    ) {
      return [row, column, Role.EMPTY]
    }
    return [row, column, role]
  })

  return {
    newBoard,
    eaten: !!removedChesses.size,
  }
}
