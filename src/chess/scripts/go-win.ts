import {Role} from '@chess/helper'
import {DataTable, safeLoop, tableListToTable} from 'awesome-chart'
import {RawTableList} from 'awesome-chart/dist/types'

export function whoIsGoChessWinner(props: {data: RawTableList}) {
  const {data} = props
  const {rows, columns, body} = new DataTable(tableListToTable(data))
  const [maxRow, maxColumn] = [rows.length, columns.length]
  const emptyPool: Set<Vec2> = new Set()
  let whiteScore = 0
  let blackScore = 0

  for (let i = 0; i < maxRow; i++) {
    for (let j = 0; j < maxColumn; j++) {
      body[i][j] === Role.EMPTY && emptyPool.add([i, j])
    }
  }

  safeLoop(
    () => emptyPool.size !== 0,
    () => {
      let emptySize = 0
      let hasBlack = false
      let hasWhite = false
      const judgement = (row: number, column: number) => {
        if (body[row][column] === Role.EMPTY) {
          findArea(row, column)
        } else if (body[row][column] === Role.WHITE) {
          hasWhite = true
        } else if (body[row][column] === Role.BLACK) {
          hasBlack = true
        }
      }
      const findArea = (row: number, column: number) => {
        emptySize++
        emptyPool.delete([row, column])
        row > 0 && judgement(row - 1, column)
        row < maxRow - 1 && judgement(row + 1, column)
        column > 0 && judgement(row, column - 1)
        column < maxColumn - 1 && judgement(row, column + 1)
      }

      findArea(...Array.from(emptyPool)[0])

      if (hasBlack && hasWhite) {
        whiteScore += emptySize / 2
        blackScore += emptySize / 2
      } else if (hasBlack) {
        blackScore += emptySize
      } else if (hasWhite) {
        whiteScore += emptySize
      }
    }
  )

  return blackScore - 3.75 > whiteScore
    ? Role.BLACK
    : blackScore - 3.75 < whiteScore
    ? Role.WHITE
    : Role.EMPTY
}
