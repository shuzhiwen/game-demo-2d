import {Chart, DataTableList, darkTheme, robustRange} from 'awesome-chart'
import {ElSource, RawTableList} from 'awesome-chart/dist/types'
import {merge} from 'lodash-es'
import {Role, boardId, boardSize, decodeSource} from './chaos'

const myTheme = merge({}, darkTheme, {animation: {update: {duration: 0, delay: 0}}})

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
    padding: [20, 20, 20, 20],
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
  const scatterLayer = chart.createLayer({
    id: boardId,
    type: 'scatter',
    layout: chart.layout.main,
  })
  const initialChesses = ([['x', 'y', 'category']] as RawTableList).concat(
    robustRange(0, boardSize).flatMap((row) =>
      robustRange(0, boardSize).map((column) => [row, column, Role.EMPTY])
    )
  )

  axisLayer?.setScale({nice: {fixedStep: 1}})
  axisLayer?.setStyle({
    maxScaleXTextNumber: Infinity,
    axisLineAxisX: {strokeOpacity: 0.5},
    axisLineAxisY: {strokeOpacity: 0.5},
    textX: {hidden: true},
    textY: {hidden: true},
  })

  scatterLayer?.setData(new DataTableList(initialChesses))
  scatterLayer?.setStyle({
    pointSize: [cellSize / 4, cellSize / 4],
    text: {hidden: true},
    point: {
      mapping(config) {
        const {category} = decodeSource(config.source as ElSource[])
        switch (category) {
          case Role.WHITE:
            return {...config, fill: '#ffffff'}
          case Role.BLACK:
            return {...config, fill: '#000000'}
          default:
            return {...config, fill: '#00000000'}
        }
      },
    },
  })

  chart.draw()

  return chart
}
