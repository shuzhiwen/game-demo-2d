import {GoPayload, Role} from '@chess/helper'
import {TransportHistoryQuery} from '@generated'
import {
  DataTable,
  isRealNumber,
  safeLoop,
  tableListToTable,
} from 'awesome-chart'
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
      const [x, y] = chessPool.shift()!

      visited.add(x * maxColumn + y)

      if (x > 0 && !visited.has((x - 1) * maxColumn + y)) {
        const top = body[x - 1][y]
        if (top === Role.EMPTY) {
          life++
        } else if (top === role) {
          chessPool.push([x - 1, y])
        }
      }
      if (x < maxRow - 1 && !visited.has((x + 1) * maxColumn + y)) {
        const bottom = body[x + 1][y]
        if (bottom === Role.EMPTY) {
          life++
        } else if (bottom === role) {
          chessPool.push([x + 1, y])
        }
      }
      if (y > 0 && !visited.has(x * maxColumn + y - 1)) {
        const left = body[x][y - 1]
        if (left === Role.EMPTY) {
          life++
        } else if (left === role) {
          chessPool.push([x, y - 1])
        }
      }
      if (y < maxColumn - 1 && !visited.has(x * maxColumn + y + 1)) {
        const right = body[x][y + 1]
        if (right === Role.EMPTY) {
          life++
        } else if (right === role) {
          chessPool.push([x, y + 1])
        }
      }
    }
  )

  return {life, visited}
}

export function checkEatGoChess(props: GoCheckProps) {
  const {data, position, role} = props
  const [x, y] = position

  data.forEach((item) => {
    item[0] === x && item[1] === y && (item[2] = role)
  })

  const table = new DataTable(tableListToTable(data))
  const body = table.body as RawTableList<Role>
  const checkList: Vec2[] = [
    [x - 1, y],
    [x + 1, y],
    [x, y - 1],
    [x, y + 1],
  ]
  const removedChesses = checkList.reduce((removed, [x, y]) => {
    if (body[x]?.[y] !== role) {
      const {life, visited} = checkAppendGoChess({
        data,
        position: [x, y],
        role: body[x]?.[y] ?? Role.EMPTY,
      })
      if (life === 0) {
        Array.from(visited).forEach((item) => removed.add(item))
      }
    }
    return removed
  }, new Set<number>())
  const nextBoard = data.map(([x, y, role], index) => {
    if (
      index !== 0 &&
      isRealNumber(x) &&
      isRealNumber(y) &&
      removedChesses.has(x * table.columns.length + y)
    ) {
      return [x, y, Role.EMPTY]
    }
    return [x, y, role]
  })

  return {
    nextBoard,
    eaten: !!removedChesses.size,
  }
}

function createGameSnapshot(data: RawTableList) {
  return data.map((group) => group.join('.')).join('__')
}

export function isGoBoardRepeat(props: {
  data: RawTableList
  history: TransportHistoryQuery['transportHistory']
}) {
  const {data, history} = props
  const historyBoards = (history ?? [])
    .filter(({data}) => data?.kind === 'chess')
    .map(({data}) => (data?.payload as GoPayload)?.board)
  const currentSnapshot = createGameSnapshot(data)
  const historySnapShot = historyBoards.map(createGameSnapshot)

  return historySnapShot.includes(currentSnapshot)
}
