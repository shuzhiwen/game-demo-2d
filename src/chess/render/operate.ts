import {Chart, DataTableList, LayerScatter} from 'awesome-chart'
import {RawTableList} from 'awesome-chart/dist/types'
import {Role, boardId, focusBoardId, readyBoardId} from '../helper'
import {initialChess} from './board'

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
    chart.draw()
  }
}

export function replaceBoard(props: {data: RawTableList; chart: Chart}) {
  const {data, chart} = props
  const layer = chart.getLayerById(boardId)
  layer?.setData(new DataTableList(data))
  chart.draw()
}

export function appendReadyChess(props: {role: Role; position: Vec2; chart: Chart}) {
  const {role, position, chart} = props
  const layer = chart.getLayerById(boardId) as LayerScatter
  const readyLayer = chart.getLayerById(readyBoardId) as LayerScatter
  const data = readyLayer.data?.rawTableListWithHeaders ?? []
  const {isEmpty, index} = getChess(data, ...position)
  let status: 'ready' | 'action' | 'invalid' = 'ready'

  if (!getChess(layer.data?.rawTableList ?? [], ...position).isEmpty) {
    readyLayer.setData(new DataTableList(initialChess()))
    status = 'invalid'
  } else if (!isEmpty) {
    readyLayer.setData(new DataTableList(initialChess()))
    status = 'action'
  } else if (data) {
    data.forEach((datum, i) => i && (datum[2] = Role.EMPTY))
    data[index][2] = role
    readyLayer.setData(new DataTableList(data))
    chart.draw()
  }

  return status
}

export function appendFocusChess(props: {role: Role; position: Vec2; chart: Chart}) {
  const data = initialChess()
  const {role, position, chart} = props
  const {index} = getChess(data, ...position)
  const layer = chart.getLayerById(focusBoardId) as LayerScatter

  data[index][2] = role
  layer.setData(new DataTableList(data))
  chart.draw()
}