import {Chart, DataTableList, darkTheme, robustRange} from 'awesome-chart'
import {
  CacheLayerAnimation,
  ElConfig,
  RawTableList,
} from 'awesome-chart/dist/types'
import {merge} from 'lodash-es'
import {ChineseChess, Role, RoleColorDict, boardId, boardSize} from '../helper'
import {ChessSourceMeta} from './chess'

const myTheme = merge({}, darkTheme, {
  text: {shadow: ''},
  animation: {update: {duration: 0, delay: 0}},
})

const colorMappingFactory = (mode: 'chess' | 'chinese') => (d: ElConfig) => {
  const {role, focused} = d.source.meta as ChessSourceMeta
  const valid = role !== Role.EMPTY

  return {
    ...d,
    stroke: mode === 'chess' ? d.stroke : RoleColorDict[role],
    fill: mode === 'chess' ? RoleColorDict[role] : d.fill,
    fillOpacity: valid ? 1 : 0,
    opacity: focused ? 0.5 : 1,
  }
}

const highlightAnimationConfig: CacheLayerAnimation<'highlight'>['options'] = {
  highlight: {
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
}

const initialChess = ([['x', 'y', 'role']] as RawTableList).concat(
  robustRange(0, boardSize).flatMap((x) => {
    return robustRange(0, boardSize).map((y) => [x, y, Role.EMPTY])
  })
)

export function createBoard(props: {
  role: Role
  container: HTMLElement
  initialDisabled: boolean
}) {
  const {container, role, initialDisabled} = props
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
  const chessLayer = chart.createLayer({
    id: boardId,
    type: 'chess',
    layout: chart.layout.main,
  })!

  chessLayer.role = role
  chessLayer.disabled = initialDisabled
  chessLayer.setAnimation(highlightAnimationConfig)
  chessLayer.setData(new DataTableList(initialChess))
  chessLayer.setStyle({
    chessSize: [cellSize / 3, cellSize / 3],
    chess: {
      mapping: colorMappingFactory('chess'),
    },
    highlight: {
      strokeWidth: 2,
      stroke: 'orange',
      fillOpacity: 0,
    },
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

export function createChineseBoard(props: {
  role: Role
  container: HTMLElement
  initialDisabled: boolean
}) {
  const {container, role, initialDisabled} = props
  const {width, height} = container.getBoundingClientRect()
  const containerSize = Math.min(width, height)
  const chart = new Chart({
    engine: 'svg',
    adjust: false,
    width: containerSize,
    height: containerSize,
    padding: [32, 32, 32, 32],
    container: props.container,
    theme: myTheme,
    tooltipOptions: {
      render: (import.meta as any).env.DEV ? undefined : () => null,
    },
  })
  const chineseLayer = chart.createLayer({
    id: boardId,
    type: 'chinese',
    layout: chart.layout.main,
  })!
  const chessMap = new Map(
    initialChineseChess.map(([x, y, ...data]) => {
      return [`${x}-${y}`, data]
    })
  )
  const initialData = ([['x', 'y', 'role', 'chess']] as RawTableList).concat(
    robustRange(0, 8).flatMap((x) =>
      robustRange(0, 9).map((y) => {
        return [x, y, ...(chessMap.get(`${x}-${y}`) || [Role.EMPTY, -1])]
      })
    )
  )

  chineseLayer.role = role
  chineseLayer.disabled = initialDisabled
  chineseLayer.setAnimation(highlightAnimationConfig)
  chineseLayer.setData(new DataTableList(initialData))
  chineseLayer.setStyle({
    text: {
      fontSize: 16,
      mapping: colorMappingFactory('chess'),
    },
    chess: {
      strokeWidth: 2,
      fill: '#ffdead',
      mapping: colorMappingFactory('chinese'),
    },
    highlight: {
      strokeWidth: 2,
      stroke: 'orange',
      fillOpacity: 0,
    },
    line: {
      strokeWidth: 2,
    },
  })

  return chart
}
