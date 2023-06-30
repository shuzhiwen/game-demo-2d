import {ElSource} from 'awesome-chart/dist/types'

export const boardId = 'board'

export const readyBoardId = 'ready_board'

export const boardSize = 12

export enum Role {
  BLACK = 1,
  WHITE = 2,
  EMPTY = 3,
}

export function decodeSource(source: ElSource[]) {
  return {
    category: source.find((item) => item.category === 'category')?.value,
    x: source.find((item) => item.category === 'x')?.value,
    y: source.find((item) => item.category === 'y')?.value,
  }
}
