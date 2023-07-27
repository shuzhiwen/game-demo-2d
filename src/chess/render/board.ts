import {Chart, DataTableList, darkTheme, robustRange} from 'awesome-chart'
import {ElSource, GraphStyle, RawTableList} from 'awesome-chart/dist/types'
import {merge} from 'lodash-es'
import {Role, boardId, boardSize, decodeSource, focusBoardId, readyBoardId} from '../helper'

const myTheme = merge({}, darkTheme, {
  animation: {update: {duration: 0, delay: 0}},
})

export const initialChess = () =>
  ([['x', 'y', 'category']] as RawTableList).concat(
    robustRange(0, boardSize).flatMap((x) =>
      robustRange(0, boardSize).map((y) => [x, y, Role.EMPTY])
    )
  )

const mapping: GraphStyle['mapping'] = (config) => {
  const {category} = decodeSource(config.source as ElSource[])
  switch (category) {
    case Role.WHITE:
      return {...config, fill: '#ffffff'}
    case Role.BLACK:
      return {...config, fill: '#000000'}
    default:
      return {...config, fill: '#00000000'}
  }
}

const focusMapping: GraphStyle['mapping'] = (config) => {
  const {category} = decodeSource(config.source as ElSource[])
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
    id: readyBoardId,
    type: 'scatter',
    layout: chart.layout.main,
  })
  const focusScatterLayer = chart.createLayer({
    id: focusBoardId,
    type: 'scatter',
    layout: chart.layout.main,
  })
  const scatterLayer = chart.createLayer({
    id: boardId,
    type: 'scatter',
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
    point: {mapping},
  })

  readyScatterLayer?.setData(new DataTableList(initialChess()))
  readyScatterLayer?.setStyle({
    pointSize: [cellSize / 3, cellSize / 3],
    point: {opacity: 0.5, mapping},
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
