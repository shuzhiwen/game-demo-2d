import {Chart, DataTableList, darkTheme, robustRange} from 'awesome-chart'
import {ElSource, GraphStyle, RawTableList} from 'awesome-chart/dist/types'
import {merge} from 'lodash-es'
import {Role, boardId, boardSize, decodeSource, readyBoardId} from './chaos'

const myTheme = merge({}, darkTheme, {
  animation: {update: {duration: 0, delay: 0}},
})

export const initialChesses = ([['x', 'y', 'category']] as RawTableList).concat(
  robustRange(0, boardSize).flatMap((row) =>
    robustRange(0, boardSize).map((column) => [row, column, Role.EMPTY])
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

export function createBoard(props: {container: HTMLDivElement}) {
  const {container} = props
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
      render: () => null,
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
  const scatterLayer = chart.createLayer({
    id: boardId,
    type: 'scatter',
    layout: chart.layout.main,
  })

  axisLayer?.setScale({nice: {fixedStep: 1}})
  axisLayer?.setStyle({
    maxScaleXTextNumber: Infinity,
    axisLineAxisX: {strokeWidth: 2, strokeOpacity: 0.8},
    axisLineAxisY: {strokeWidth: 2, strokeOpacity: 0.8},
    splitLineAxisX: {strokeWidth: 2, strokeOpacity: 0.8},
    splitLineAxisY: {strokeWidth: 2, strokeOpacity: 0.8},
    textX: {hidden: true},
    textY: {hidden: true},
  })

  scatterLayer?.setData(new DataTableList(initialChesses))
  scatterLayer?.setStyle({
    pointSize: [cellSize / 3, cellSize / 3],
    text: {hidden: true},
    point: {mapping},
  })

  readyScatterLayer?.setData(new DataTableList(initialChesses))
  readyScatterLayer?.setStyle({
    pointSize: [cellSize / 3, cellSize / 3],
    point: {opacity: 0.5, mapping},
    text: {hidden: true},
  })

  return chart
}
