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
      const judgement = (x: number, y: number) => {
        if (body[x][y] === Role.EMPTY) {
          findArea(x, y)
        } else if (body[x][y] === Role.WHITE) {
          hasWhite = true
        } else if (body[x][y] === Role.BLACK) {
          hasBlack = true
        }
      }
      const findArea = (x: number, y: number) => {
        emptySize++
        emptyPool.delete([x, y])
        x > 0 && judgement(x - 1, y)
        x < maxRow - 1 && judgement(x + 1, y)
        y > 0 && judgement(x, y - 1)
        y < maxColumn - 1 && judgement(x, y + 1)
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
