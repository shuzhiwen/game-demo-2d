import {Role} from '@chess/helper'
import {uuid} from 'awesome-chart'
import {D3Selection, ElConfig} from 'awesome-chart/dist/types'
import {select} from 'd3'
import {ChessSourceMeta} from './chess'

export function addLightForElement(
  datum: ElConfig<'ellipse'>,
  index: number,
  groups: HTMLElement[]
) {
  const {cx, cy, rx, ry, source} = datum
  const {role} = source.meta as ChessSourceMeta
  const parent = select(groups[index].parentElement)
  const root = select(groups[index])

  if (role !== Role.EMPTY && !root.select('filter').size()) {
    const filterId = 'filter-light-' + uuid()
    const maskId = 'filter-mask-' + uuid()
    const filter = root.append('filter').attr('id', filterId)

    parent
      .append('mask')
      .attr('id', maskId)
      .append('ellipse')
      .attr('cx', cx)
      .attr('cy', cy)
      .attr('rx', rx)
      .attr('ry', ry)
      .attr('fill', 'white')
    filter
      .append('feDiffuseLighting')
      .attr('in', 'SourceGraphic')
      .attr('result', 'light')
      .attr('diffuseConstant', 2)
      .attr('lighting-color', 'gray')
      .append('fePointLight')
      .attr('x', cx - rx / 3)
      .attr('y', cy - ry / 3)
      .attr('z', role === Role.WHITE ? 5 : 2)
    filter
      .append('feBlend')
      .attr('in', 'SourceGraphic')
      .attr('in2', 'light')
      .attr('mode', 'lighten')

    root.attr('mask', `url(#${maskId})`)
    root.attr('filter', `url(#${filterId})`)
  } else if (role === Role.EMPTY) {
    root.attr('mask', null)
    root.attr('filter', null)
  }
}

export function addShadowForContainer(root: D3Selection) {
  const filterId = 'filter-shadow-' + uuid()
  const filter = root.attr('filter', `url(#${filterId})`).append('filter')

  filter
    .attr('id', filterId)
    .append('feDropShadow')
    .attr('in', 'SourceGraphic')
    .attr('result', 'outerShadow')
    .attr('dx', 2)
    .attr('dx', 2)
    .attr('stdDeviation', 2)
    .attr('flood-color', 'black')
  filter.append('feGaussianBlur').attr('stdDeviation', 6).attr('result', 'blur')
  filter
    .append('feComposite')
    .attr('operator', 'out')
    .attr('in', 'SourceGraphic')
    .attr('in2', 'blur')
    .attr('result', 'inverse')
  filter.append('feFlood').attr('flood-color', 'black').attr('result', 'color')
  filter
    .append('feComposite')
    .attr('operator', 'in')
    .attr('in', 'color')
    .attr('in2', 'inverse')
    .attr('result', 'innerShadow')
  filter
    .append('feComposite')
    .attr('operator', 'over')
    .attr('in', 'innerShadow')
    .attr('in2', 'outerShadow')
}
