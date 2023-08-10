import {ChineseChess, Role} from '@chess/helper'
import {robustRange} from 'awesome-chart'
import {RawTableList} from 'awesome-chart/dist/types'

interface GoCheckProps {
  role: Role
  chess: ChineseChess
  data: RawTableList
  position: Vec2
  nextPosition: Vec2
}

type SubCheckProps = Omit<GoCheckProps, 'data'> & {
  data: Map<string, [Role, ChineseChess]>
}

const createKey = (keys: Meta[]) => keys.join('-')

const SubCheckDict: Record<ChineseChess, (props: SubCheckProps) => boolean> = {
  [ChineseChess.KING]: checkPlaceChineseChessForKing,
  [ChineseChess.MANDARIN]: checkPlaceChineseChessForMandarin,
  [ChineseChess.ELEPHANT]: checkPlaceChineseChessForElephant,
  [ChineseChess.KNIGHT]: checkPlaceChineseChessForKnight,
  [ChineseChess.ROOK]: checkPlaceChineseChessForCannonOrRook,
  [ChineseChess.CANNON]: checkPlaceChineseChessForCannonOrRook,
  [ChineseChess.PAWN]: checkPlaceChineseChessForPawn,
}

export function checkPlaceChineseChess(props: GoCheckProps) {
  const {data: rawData, ...rest} = props
  const {role, position, nextPosition, chess} = rest
  const data: Map<string, [Role, ChineseChess]> = new Map(
    rawData.map(([x, y, ...data]) => [createKey([x, y]), data as any])
  )

  if (
    // 不能吃自己的子
    createKey(position) === createKey(nextPosition) ||
    data.get(createKey(nextPosition))?.[0] === role
  ) {
    return
  }

  return SubCheckDict[chess]({...rest, data})
}

function checkPlaceChineseChessForPawn(props: SubCheckProps) {
  const {role, position, nextPosition} = props
  const [prevX, prevY, nextX, nextY] = [...position, ...nextPosition]

  if (role === Role.BLACK) {
    if (prevY <= 4) {
      // 上方黑卒未过河
      if (prevX === nextX && nextY === prevY + 1) {
        return true
      }
    } else {
      // 上方黑卒已过河
      if (nextY > 4 && Math.abs(nextX - prevX) + Math.abs(nextY - prevY) === 1) {
        return true
      }
    }
  } else if (role === Role.RED) {
    if (prevY > 4) {
      // 下方红兵未过河
      if (prevX === nextX && nextY === prevY - 1) {
        return true
      }
    } else {
      // 下方红兵已过河
      if (nextY <= 4 && Math.abs(nextX - prevX) + Math.abs(nextY - prevY) === 1) {
        return true
      }
    }
  }

  return false
}

export function checkPlaceChineseChessForCannonOrRook(props: SubCheckProps) {
  const {chess, data, position, nextPosition} = props
  const [prevX, prevY, nextX, nextY] = [...position, ...nextPosition]

  // 车炮竖着走
  if (prevX === nextX && prevY !== nextY) {
    const [min, max] = prevY < nextY ? [prevY, nextY] : [nextY, prevY]
    const chessOnPath = robustRange(min, max, 1)
      .map((y) => data.get(createKey([nextX, y]))?.[0])
      .filter((role) => role !== Role.EMPTY)

    return chess === ChineseChess.CANNON
      ? chessOnPath.length <= 1
      : chess === ChineseChess.ROOK
      ? chessOnPath.length === 0
      : false
  }
  // 车炮横着走
  if (prevY === nextY && prevX !== nextX) {
    const [min, max] = prevX < nextX ? [prevX, nextX] : [nextX, prevX]
    const chessOnPath = robustRange(min, max, 1)
      .map((x) => data.get(createKey([x, nextY]))?.[0])
      .filter((role) => role !== Role.EMPTY)

    return chess === ChineseChess.CANNON
      ? chessOnPath.length <= 1
      : chess === ChineseChess.ROOK
      ? chessOnPath.length === 0
      : false
  }

  return false
}

export function checkPlaceChineseChessForKnight(props: SubCheckProps) {
  const {data, position, nextPosition} = props
  const [prevX, prevY, nextX, nextY] = [...position, ...nextPosition]

  if (
    // left
    (nextX === prevX - 2 &&
      Math.abs(nextY - prevY) === 1 &&
      data.get(createKey([prevX - 1, prevY]))?.[0] === Role.EMPTY) ||
    // right
    (nextX === prevX + 2 &&
      Math.abs(nextY - prevY) === 1 &&
      data.get(createKey([prevX + 1, prevY]))?.[0] === Role.EMPTY) ||
    // top
    (nextY === prevY - 2 &&
      Math.abs(nextX - prevX) === 1 &&
      data.get(createKey([prevX, prevY - 1]))?.[0] === Role.EMPTY) ||
    // bottom
    (nextY === prevY + 2 &&
      Math.abs(nextX - prevX) === 1 &&
      data.get(createKey([prevX, prevY + 1]))?.[0] === Role.EMPTY)
  ) {
    return true
  }

  return false
}

export function checkPlaceChineseChessForElephant(props: SubCheckProps) {
  const {role, data, position, nextPosition} = props
  const [prevX, prevY, nextX, nextY] = [...position, ...nextPosition]
  const centerPosition = [(prevX + nextX) / 2, (prevY + nextY) / 2]

  if (
    Math.abs(nextX - prevX) === 2 &&
    Math.abs(nextY - prevY) === 2 &&
    data.get(createKey(centerPosition))?.[0] === Role.EMPTY &&
    ((role === Role.BLACK && nextY <= 4) || (role === Role.RED && nextY > 4))
  ) {
    return true
  }

  return false
}

export function checkPlaceChineseChessForMandarin(props: SubCheckProps) {
  const {role, position, nextPosition} = props
  const [prevX, prevY, nextX, nextY] = [...position, ...nextPosition]
  const between = (d: Meta, min: Meta, max: Meta) => d >= min && d <= max

  if (
    Math.abs(nextX - prevX) === 1 &&
    Math.abs(nextY - prevY) === 1 &&
    ((role === Role.BLACK && between(nextX, 3, 5) && between(nextY, 0, 2)) ||
      (role === Role.RED && between(nextX, 3, 5) && between(nextY, 7, 9)))
  ) {
    return true
  }

  return false
}

export function checkPlaceChineseChessForKing(props: SubCheckProps) {
  const {role, position, nextPosition} = props
  const [prevX, prevY, nextX, nextY] = [...position, ...nextPosition]
  const between = (d: Meta, min: Meta, max: Meta) => d >= min && d <= max

  if (
    Math.abs(nextX - prevX) + Math.abs(nextY - prevY) === 1 &&
    ((role === Role.BLACK && between(nextX, 3, 5) && between(nextY, 0, 2)) ||
      (role === Role.RED && between(nextX, 3, 5) && between(nextY, 7, 9)))
  ) {
    return true
  }

  return false
}
