import {DataTable, tableListToTable} from 'awesome-chart'
import {RawTableList} from 'awesome-chart/dist/types'

export function isGoChessWin(props: {data: RawTableList; position: Vec2}) {
  const {data, position} = props
  const table = new DataTable(tableListToTable(data))

  return true
}
