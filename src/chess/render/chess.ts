import {GobangPayload, Role} from '@chess/helper'
import {
  Chart,
  DataTableList,
  EventManager,
  LayerBase,
  LayerDict,
  LayerScatter,
  checkColumns,
  createStyle,
  registerCustomLayer,
  scaleLinear,
  tableListToObjects,
  ungroup,
  validateAndCreateData,
} from 'awesome-chart'
import {
  BasicLayerOptions,
  ChartContext,
  CircleDrawerProps,
  DrawerData,
  GraphStyle,
  LayerScatterOptions,
  LayerScatterScale,
} from 'awesome-chart/dist/types'
import {cloneDeep, isEqual} from 'lodash-es'

type DataKey = 'x' | 'y' | 'role'

type LayerStyle = Partial<{
  chessSize: Vec2
  chess: GraphStyle
  highlight: GraphStyle
}>

export type ChessSourceMeta = {
  focused: boolean
  position: Vec2
  role: Role
}

export function createChessLayer(
  chart: Chart,
  options: Omit<LayerScatterOptions, 'type'>
): LayerChess {
  if (!Object.keys(LayerDict).includes('chess')) {
    registerCustomLayer('chess', LayerChess)
  }

  return chart.createLayer({...options, type: 'chess' as any})
}

export class LayerChess extends LayerBase<BasicLayerOptions<any>, 'chess' | 'highlight'> {
  chessEvent = new EventManager<'chess', (data: GobangPayload) => void>()

  data: Maybe<DataTableList>

  scale: Omit<LayerScatterScale, 'scalePointSize'> = {}

  style: LayerStyle = {}

  role: Maybe<Role>

  disabled = false

  highlightPosition: Maybe<Vec2>

  private focusPosition: Maybe<Vec2>

  private chessData: (DrawerData<CircleDrawerProps> & {
    meta: ChessSourceMeta
  })[] = []

  private highlightChessData: Maybe<DrawerData<CircleDrawerProps>>

  constructor(options: BasicLayerOptions<any>, context: ChartContext) {
    super({context, options, sublayers: ['chess', 'highlight']})
  }

  setData(data: LayerScatter['data']) {
    const {width, height} = this.options.layout

    this.data = validateAndCreateData('tableList', this.data, data)
    this.focusPosition = null

    checkColumns(this.data, ['x', 'y', 'role'])

    this.scale = {
      scaleX: scaleLinear({
        domain: this.data!.select('x').range(),
        range: [0, width],
      }),
      scaleY: scaleLinear({
        domain: this.data!.select('y').range(),
        range: [height, 0],
      }),
    }
  }

  setStyle(style: LayerStyle) {
    this.style = createStyle(this.options, {}, this.style ?? {}, style)
  }

  update() {
    if (!this.data || !this.scale) {
      throw new Error('Invalid data or scale')
    }

    const {chessSize} = this.style,
      {top, left, width, height} = this.options.layout,
      data = tableListToObjects<DataKey, number>(this.data.source),
      scaleX = scaleLinear({
        domain: this.data.select('x').range(),
        range: [0, width],
      }),
      scaleY = scaleLinear({
        domain: this.data.select('y').range(),
        range: [height, 0],
      })

    this.chessData = data.map(({x, y, role}) => ({
      x: left + scaleX(x),
      y: top + scaleY(y),
      r: ungroup(chessSize) ?? 5,
      meta: {
        position: [x, y],
        focused: isEqual(this.focusPosition, [x, y]),
        highlight: isEqual(this.highlightPosition, [x, y]),
        role: isEqual(this.focusPosition, [x, y]) ? this.role! : role,
      },
    }))

    this.highlightChessData = this.chessData.find(({meta}) =>
      isEqual(meta.position, this.highlightPosition)
    )
  }

  draw() {
    this.drawBasic({
      type: 'circle',
      key: 'chess',
      data: [{data: this.chessData, ...this.style.chess}],
    })
    this.drawBasic({
      type: 'circle',
      key: 'highlight',
      data: [
        {
          data: [this.highlightChessData ?? {x: -1, y: -1, r: 0}],
          opacity: this.highlightChessData ? 1 : 0,
          ...this.style.highlight,
        },
      ],
    })

    this.event.onWithOff('click-chess', 'internal', ({data}) => {
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
