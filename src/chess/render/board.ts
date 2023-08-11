import {Chart, DataTableList, darkTheme, robustRange} from 'awesome-chart'
import {ElConfig, GraphStyle, RawTableList} from 'awesome-chart/dist/types'
import {merge} from 'lodash-es'
import {
  ChineseChess,
  Role,
  RoleColorDict,
  boardId,
  boardSize,
  decodeSource,
  focusBoardId,
  readyBoardId,
} from '../helper'
import {ChineseSourceMeta, createChineseChessLayer} from './chinese'

export const initialChess = () =>
  ([['x', 'y', 'category']] as RawTableList).concat(
    robustRange(0, boardSize).flatMap((x) =>
      robustRange(0, boardSize).map((y) => [x, y, Role.EMPTY])
    )
  )

const myTheme = merge({}, darkTheme, {
  animation: {update: {duration: 0, delay: 0}},
})

const chessColorMapping = (config: ElConfig): ElConfig => {
  const {category} = decodeSource(config.source)
  return {...config, fill: RoleColorDict[category]}
}

const focusMapping: GraphStyle['mapping'] = (config) => {
  const {category} = decodeSource(config.source)
  switch (category) {
    case Role.EMPTY:
      return config
    default:
      return {...config, strokeWidth: 5, stroke: 'orange'}
  }
}

export function createBoard(props: {container: HTMLElement; initialData: RawTableList}) {
  const {container, initialData} = props
  const {width, height} = container.getBoundingClientRect()
  const containerSize = Math.min(width, height)
  const cellSize = containerSize / boardSize
  const chart = new Chart({
    engine: 'svg',
    adjust: false,
    width: containerSize,
    height: containerSize,
    padding: [24, 24, 24, 24],
    container: props.container,
    theme: myTheme,
    tooltipOptions: {
      render: (import.meta as any).env.DEV ? undefined : () => null,
    },
  })
  const axisLayer = chart.createLayer({
    id: 'axis',
    type: 'axis',
    layout: chart.layout.main,
  })
  const readyScatterLayer = chart.createLayer({
    type: 'scatter',
    id: readyBoardId,
    layout: chart.layout.main,
  })
  const focusScatterLayer = chart.createLayer({
    type: 'scatter',
    id: focusBoardId,
    layout: chart.layout.main,
  })
  const scatterLayer = chart.createLayer({
    type: 'scatter',
    id: boardId,
    layout: chart.layout.main,
  })

  axisLayer?.setScale({nice: {fixedStep: 1}})
  axisLayer?.setStyle({
    maxScaleXTextNumber: Infinity,
    axisLineAxisX: {strokeWidth: 2, strokeOpacity: 0.4},
    axisLineAxisY: {strokeWidth: 2, strokeOpacity: 0.4},
    splitLineAxisX: {strokeWidth: 2, strokeOpacity: 0.4},
    splitLineAxisY: {strokeWidth: 2, strokeOpacity: 0.4},
    textX: {hidden: true},
    textY: {hidden: true},
  })

  scatterLayer?.setData(new DataTableList(initialData))
  scatterLayer?.setStyle({
    pointSize: [cellSize / 3, cellSize / 3],
    text: {hidden: true},
    point: {mapping: chessColorMapping},
  })

  readyScatterLayer?.setData(new DataTableList(initialChess()))
  readyScatterLayer?.setStyle({
    pointSize: [cellSize / 3, cellSize / 3],
    point: {opacity: 0.5, mapping: chessColorMapping},
    text: {hidden: true},
  })

  focusScatterLayer?.setData(new DataTableList(initialChess()))
  focusScatterLayer?.setStyle({
    pointSize: [cellSize / 3, cellSize / 3],
    point: {fillOpacity: 0, mapping: focusMapping},
    text: {hidden: true},
  })
  focusScatterLayer?.setAnimation({
    point: {
      loop: {
        type: 'fade',
        delay: 1000,
        duration: 2000,
        initialOpacity: 1,
        startOpacity: 1,
        endOpacity: 0.2,
        alternate: true,
      },
    },
  })

  return chart
}

const initialChineseChess: RawTableList = [
  [0, 0, Role.BLACK, ChineseChess['ROOK']],
  [1, 0, Role.BLACK, ChineseChess['KNIGHT']],
  [2, 0, Role.BLACK, ChineseChess['ELEPHANT']],
  [3, 0, Role.BLACK, ChineseChess['MANDARIN']],
  [4, 0, Role.BLACK, ChineseChess['KING']],
  [5, 0, Role.BLACK, ChineseChess['MANDARIN']],
  [6, 0, Role.BLACK, ChineseChess['ELEPHANT']],
  [7, 0, Role.BLACK, ChineseChess['KNIGHT']],
  [8, 0, Role.BLACK, ChineseChess['ROOK']],
  [1, 2, Role.BLACK, ChineseChess['CANNON']],
  [7, 2, Role.BLACK, ChineseChess['CANNON']],
  [0, 3, Role.BLACK, ChineseChess['PAWN']],
  [2, 3, Role.BLACK, ChineseChess['PAWN']],
  [4, 3, Role.BLACK, ChineseChess['PAWN']],
  [6, 3, Role.BLACK, ChineseChess['PAWN']],
  [8, 3, Role.BLACK, ChineseChess['PAWN']],
  [0, 9, Role.RED, ChineseChess['ROOK']],
  [1, 9, Role.RED, ChineseChess['KNIGHT']],
  [2, 9, Role.RED, ChineseChess['ELEPHANT']],
  [3, 9, Role.RED, ChineseChess['MANDARIN']],
  [4, 9, Role.RED, ChineseChess['KING']],
  [5, 9, Role.RED, ChineseChess['MANDARIN']],
  [6, 9, Role.RED, ChineseChess['ELEPHANT']],
  [7, 9, Role.RED, ChineseChess['KNIGHT']],
  [8, 9, Role.RED, ChineseChess['ROOK']],
  [1, 7, Role.RED, ChineseChess['CANNON']],
  [7, 7, Role.RED, ChineseChess['CANNON']],
  [0, 6, Role.RED, ChineseChess['PAWN']],
  [2, 6, Role.RED, ChineseChess['PAWN']],
  [4, 6, Role.RED, ChineseChess['PAWN']],
  [6, 6, Role.RED, ChineseChess['PAWN']],
  [8, 6, Role.RED, ChineseChess['PAWN']],
]

const chineseChessColorMapping = (config: ElConfig): ElConfig => {
  const {category} = decodeSource(config.source)
  const {focused} = config.source.meta as ChineseSourceMeta
  const valid = category === Role.BLACK || category === Role.RED
  return {
    ...config,
    stroke: valid ? RoleColorDict[category] : '#00000000',
    fill: valid ? 'rgb(238,232,170)' : '#00000000',
    opacity: focused ? 0.5 : 1,
  }
}

export function createChineseBoard(props: {container: HTMLElement}) {
  const {container} = props
  const {width, height} = container.getBoundingClientRect()
  const containerSize = Math.min(width, height)
  const chart = new Chart({
    engine: 'svg',
    adjust: false,
    width: containerSize,
    height: containerSize,
    padding: [24, 24, 24, 24],
    container: props.container,
    theme: myTheme,
    tooltipOptions: {
      render: (import.meta as any).env.DEV ? undefined : () => null,
    },
  })
  const layer = createChineseChessLayer(chart, {
    id: focusBoardId,
    layout: chart.layout.main,
  })
  const chessMap = new Map(
    initialChineseChess.map(([x, y, ...data]) => {
      return [`${x}-${y}`, data]
    })
  )
  const initialData = ([['x', 'y', 'category', 'chess']] as RawTableList).concat(
    robustRange(0, 8).flatMap((x) =>
      robustRange(0, 9).map((y) => {
        return [x, y, ...(chessMap.get(`${x}-${y}`) || [Role.EMPTY, -1])]
      })
    )
  )

  layer.setData(new DataTableList(initialData))
  layer.setStyle({
    line: {strokeWidth: 2},
    chess: {strokeWidth: 2, mapping: chineseChessColorMapping},
    text: {fontSize: 16, mapping: chessColorMapping, shadow: ''},
  })

  return chart
}
