import {LayerDict, registerCustomLayer} from 'awesome-chart'
import {LayerChess} from './chess'
import {LayerChineseChess} from './chinese'

export * from './board'
export * from './chess'
export * from './chinese'

if (!Object.keys(LayerDict).includes('chess')) {
  registerCustomLayer('chess', LayerChess)
}

if (!Object.keys(LayerDict).includes('chinese')) {
  registerCustomLayer('chinese', LayerChineseChess)
}

declare module 'awesome-chart' {
  interface LayerDict {
    chess: LayerChess
    chinese: LayerChineseChess
  }
}
