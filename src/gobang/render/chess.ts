import {Chart, LayerScatter, isRealNumber, DataTableList} from 'awesome-chart'
import {Role, boardId} from './chaos'

export function appendChess(props: {role: Role; position: Vec2; chart: Chart}) {
  const {role, position, chart} = props
  const scatterLayer = chart.getLayerById(boardId) as LayerScatter
  const data = scatterLayer.data?.rawTableListWithHeaders
  const [x, y] = position

  if (data && isRealNumber(x) && isRealNumber(y)) {
    const datum = data.find((item) => item[0] === x && item[1] === y)
    if (datum) {
      datum[2] = role
      scatterLayer.setData(new DataTableList(data))
      scatterLayer.draw()
    }
  }
}
