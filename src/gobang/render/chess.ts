import {Chart, LayerScatter, isRealNumber, DataTableList} from 'awesome-chart'
import {ElSource} from 'awesome-chart/dist/types'
import {Chess, boardId, decodeSource} from './chaos'

export function appendChess(props: {
  role: Exclude<Chess, Chess.EMPTY>
  source: ElSource[]
  chart: Chart
}) {
  const {role, source, chart} = props
  const scatterLayer = chart.getLayerById(boardId) as LayerScatter
  const data = scatterLayer.data?.rawTableListWithHeaders
  const {x, y} = decodeSource(source)

  if (data && isRealNumber(x) && isRealNumber(y)) {
    const datum = data.find((item) => item[0] === x && item[1] === y)
    if (datum) {
      datum[2] = role
      scatterLayer.setData(new DataTableList(data))
      scatterLayer.draw()
    }
  }
}
