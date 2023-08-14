import {LayerChineseChess, LayerCommonChess} from '@chess/render'
import {Chart, DataTableList} from 'awesome-chart'
import {RawTableList} from 'awesome-chart/dist/types'
import {boardId} from '../helper'

export function replaceBoard(props: {data: RawTableList; chart: Chart; position: Vec2}) {
  const {data, chart, position} = props
  const layer = chart.getLayerById(boardId) as LayerChineseChess | LayerCommonChess
  layer.highlightPosition = position
  layer?.setData(new DataTableList(data))
  chart.draw()
}

export function encodeInviteUrl(inviteCode: string) {
  const pathname = window.location.pathname.split('/').find(Boolean)
  const base64 = btoa(encodeURI(inviteCode))
  return `${window.location.origin}/${pathname}/login?code=${base64}`
}

export function decodeInviteUrl(inviteCode: string) {
  try {
    return decodeURI(atob(inviteCode))
  } catch {
    return null
  }
}
