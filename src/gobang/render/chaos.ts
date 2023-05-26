import {ElSource} from 'awesome-chart/dist/types'

export const boardId = 'board'

export const boardSize = 8

export enum Chess {
  BLACK,
  WHITE,
  EMPTY,
}

export function decodeSource(source: ElSource[]) {
  return {
    category: source.find((item) => item.category === 'category')?.value,
    x: source.find((item) => item.category === 'x')?.value,
    y: source.find((item) => item.category === 'y')?.value,
  }
}
