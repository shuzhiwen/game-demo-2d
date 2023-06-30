import {Chart, DataTableList, LayerScatter} from 'awesome-chart'
import {initialChesses} from './board'
import {Role, boardId, readyBoardId} from './chaos'

const getChess = (data: Meta[][], x: number, y: number) => {
  const index = data.findIndex(([_x, _y]) => _x === x && _y === y)
  return {isEmpty: data[index]?.[2] === Role.EMPTY, index}
}

export function appendChess(props: {role: Role; position: Vec2; chart: Chart}) {
  const {role, position, chart} = props
  const layer = chart.getLayerById(boardId) as LayerScatter
  const data = layer.data?.rawTableListWithHeaders ?? []
  const {isEmpty, index} = getChess(data, ...position)

  if (isEmpty) {
    data[index][2] = role
    layer.setData(new DataTableList(data))
    layer.draw()
  }
}

export function appendReadyChess(props: {role: Role; position: Vec2; chart: Chart}) {
  const {role, position, chart} = props
  const layer = chart.getLayerById(boardId) as LayerScatter
  const readyLayer = chart.getLayerById(readyBoardId) as LayerScatter
  const data = readyLayer.data?.rawTableListWithHeaders ?? []
  const {isEmpty, index} = getChess(data, ...position)
  let status: 'ready' | 'action' | 'invalid' = 'ready'

  if (!getChess(layer.data?.rawTableList ?? [], ...position).isEmpty) {
    readyLayer.setData(new DataTableList(initialChesses))
    status = 'invalid'
  } else if (!isEmpty) {
    readyLayer.setData(new DataTableList(initialChesses))
    status = 'action'
  } else if (data) {
    data.forEach((datum, i) => i && (datum[2] = Role.EMPTY))
    data[index][2] = role
    readyLayer.setData(new DataTableList(data))
    readyLayer.draw()
  }

  return status
}
