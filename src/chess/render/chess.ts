import {GobangPayload, Role} from '@chess/helper'
import {
  Chart,
  EventManager,
  LayerDict,
  LayerScatter,
  registerCustomLayer,
  tableListToObjects,
  ungroup,
} from 'awesome-chart'
import {CircleDrawerProps, DrawerData, LayerScatterOptions} from 'awesome-chart/dist/types'
import {cloneDeep, isEqual} from 'lodash-es'

type DataKey = 'x' | 'y' | 'role'

export type ChessSourceMeta = {
  focused: boolean
  highlight: boolean
  position: Vec2
  role: Role
}

export function createChessLayer(
  chart: Chart,
  options: Omit<LayerScatterOptions, 'type'>
): LayerCommonChess {
  if (!Object.keys(LayerDict).includes('chess')) {
    registerCustomLayer('chess', LayerCommonChess)
  }

  return chart.createLayer({...options, type: 'chess' as any})
}

export class LayerCommonChess extends LayerScatter {
  chessEvent = new EventManager<'chess', 'user', (data: GobangPayload) => void>(
    LayerCommonChess.name
  )

  role: Maybe<Role>

  disabled = false

  highlightPosition: Maybe<Vec2>

  private focusPosition: Maybe<Vec2>

  private boardChessData: (DrawerData<CircleDrawerProps> & {
    meta: ChessSourceMeta
  })[] = []

  setData(data: LayerScatter['data']) {
    super.setData(data)
    this.focusPosition = null
  }

  update() {
    if (!this.data || !this.scale) {
      throw new Error('Invalid data or scale')
    }

    const {pointSize} = this.style,
      {scaleX, scaleY} = this.scale,
      {top, left} = this.options.layout,
      data = tableListToObjects<DataKey, number>(this.data.source)

    this.boardChessData = data.map(({x, y, role}) => ({
      x: left + scaleX(x),
      y: top + scaleY(y),
      r: ungroup(pointSize) ?? 5,
      meta: {
        position: [x, y],
        focused: isEqual(this.focusPosition, [x, y]),
        highlight: isEqual(this.highlightPosition, [x, y]),
        role: isEqual(this.focusPosition, [x, y]) ? this.role! : role,
      },
    }))
  }

  draw() {
    this.drawBasic({
      type: 'circle',
      sublayer: 'point',
      data: [{data: this.boardChessData, ...this.style.point}],
    })
    this.event.onWithOff('click-point', 'internal', ({data}) => {
      const {role, position} = data.source.meta as ChessSourceMeta

      if (this.disabled || !this.data || !this.role) {
        this.focusPosition = null
        return
      }

      if (isEqual(this.focusPosition, position)) {
        const board = cloneDeep(this.data.source)
        const focus = board.find(([x, y]) => isEqual([x, y], this.focusPosition))!

        focus[2] = this.role
        this.disabled = true
        this.chessEvent.fire('chess', {
          position: this.focusPosition,
          board,
        } as GobangPayload)
      } else {
        this.focusPosition = role === Role.EMPTY ? position : null
      }

      this.needRecalculated = true
      this.draw()
    })
  }
}
