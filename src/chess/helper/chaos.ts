import {LayerChess, LayerChineseChess} from '@chess/render'
import {Chart, DataTableList} from 'awesome-chart'
import {RawTableList} from 'awesome-chart/dist/types'
import {boardId} from '../helper'

export function replaceBoard(props: {
  data: RawTableList
  chart: Chart
  position: Vec2
}) {
  const {data, chart, position} = props
  const layer = chart.getLayerById(boardId) as LayerChineseChess | LayerChess
  layer.highlightPosition = position
  layer?.setData(new DataTableList(data))
  chart.draw()
}

export function encodeInviteUrl(inviteCode: string) {
  const pathname = window.location.pathname.split('/').find(Boolean)
  const base64 = btoa(encodeURI(inviteCode))

  return `${
    (import.meta as any).env.DEV
      ? window.location.origin
      : 'http://www.shuzhiwen.com/game'
  }/${pathname}/login?code=${base64}`
}

export function decodeInviteUrl(inviteCode: string) {
  try {
    return decodeURI(atob(inviteCode))
  } catch {
    return null
  }
}
