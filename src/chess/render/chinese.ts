import {ChineseChess, ChineseChessDict, ChinesePayload, Role} from '@chess/helper'
import {checkPlaceChineseChess} from '@chess/scripts'
import {
  Chart,
  DataTableList,
  EventManager,
  LayerBase,
  LayerDict,
  LayerScatter,
  checkColumns,
  createStyle,
  createText,
  group,
  registerCustomLayer,
  tableListToObjects,
  validateAndCreateData,
} from 'awesome-chart'
import {
  BasicLayerOptions,
  ChartContext,
  CircleDrawerProps,
  DrawerData,
  GraphStyle,
  LayerScatterOptions,
  LineDrawerProps,
  TextDrawerProps,
  TextStyle,
} from 'awesome-chart/dist/types'
import {cloneDeep, isEqual, range} from 'lodash-es'

type Key = 'line' | 'text' | 'boardText' | 'chess' | 'highlight'

type DataKey = 'x' | 'y' | 'role' | 'chess'

type LayerStyle = Partial<{
  highlight: GraphStyle
  chess: GraphStyle
  line: GraphStyle
  text: TextStyle
}>

export type ChineseSourceMeta = {
  focused: boolean
  chess: ChineseChess
  position: Vec2
  role: Role
}

export function createChineseChessLayer(
  chart: Chart,
  options: Omit<LayerScatterOptions, 'type'>
): LayerChineseChess {
  if (!Object.keys(LayerDict).includes('chineseChess')) {
    registerCustomLayer('chineseChess', LayerChineseChess)
  }

  return chart.createLayer({...options, type: 'chineseChess' as any})
}

export class LayerChineseChess extends LayerBase<BasicLayerOptions<any>, Key> {
  chessEvent = new EventManager<'chess', (data: ChinesePayload) => void>()

  data: Maybe<DataTableList>

  style: Maybe<LayerStyle>

  role: Maybe<Role>

  disabled = false

  highlightPosition: Maybe<Vec2>

  private focusPosition: Maybe<Vec2>

  private nextPosition: Maybe<Vec2>

  private lineData: DrawerData<LineDrawerProps>[] = []

  private textData: (DrawerData<TextDrawerProps> & {
    meta?: ChineseSourceMeta
  })[] = []

  private boardTextData: DrawerData<TextDrawerProps>[] = []

  private chessData: (DrawerData<CircleDrawerProps> & {
    meta: ChineseSourceMeta
  })[] = []

  private highlightChessData: Maybe<DrawerData<CircleDrawerProps>>

  constructor(options: BasicLayerOptions<any>, context: ChartContext) {
    super({context, options, sublayers: ['line', 'text', 'boardText', 'chess', 'highlight']})
    this.needRecalculated = true
  }

  setData(data: LayerScatter['data']) {
    this.data = validateAndCreateData('tableList', this.data, data)
    checkColumns(this.data, ['x', 'y', 'role', 'chess'])
    this.focusPosition = null
    this.nextPosition = null
  }

  setStyle(style: LayerStyle) {
    this.style = createStyle(this.options, {}, this.style ?? {}, style)
  }

  update() {
    if (!this.data) {
      throw new Error('There is not data available!')
    }

    const {layout} = this.options
    const data = tableListToObjects<DataKey, number>(this.data.source)
    const {top, left, width, height, right, bottom} = layout
    const [stepWidth, stepHeight] = [width / 8, height / 9]
    const chessSize = Math.max(stepWidth, stepHeight) / 2.8

    this.chessData = data.map(({x, y, role, chess}) => ({
      r: chessSize,
      x: left + x * stepWidth,
      y: top + y * stepHeight,
      meta: {
        chess,
        role,
        position: [x, y],
        focused: isEqual(this.focusPosition, [x, y]),
      },
    }))
    this.highlightChessData = this.chessData.find(({meta}) =>
      isEqual(meta.position, this.highlightPosition)
    ) || {x: -100, y: -100, r: 0}

    if (this.nextPosition && this.focusPosition) {
      const focus = this.chessData.find(({meta}) => {
        return isEqual(meta.position, this.focusPosition)
      })!
      const next = this.chessData.find(({meta}) => {
        return isEqual(meta.position, this.nextPosition)
      })!
      next.meta = {...focus.meta, position: next.meta.position}
      focus.meta = {...focus.meta, role: Role.EMPTY}
    }

    this.textData = this.chessData.map((item) =>
      createText({
        ...item,
        style: this.style?.text,
        value: ChineseChessDict[item.meta.chess]?.[item.meta.role],
        position: 'center',
      })
    )
    this.boardTextData = [
      createText({
        x: left + width / 4,
        y: top + height / 2,
        value: '楚河',
        position: 'center',
      }),
      createText({
        x: right - width / 4,
        y: top + height / 2,
        value: '汉界',
        position: 'center',
      }),
    ]
    this.lineData = range(0, 10)
      .map((i) => ({
        x1: left,
        x2: right,
        y1: top + stepHeight * i,
        y2: top + stepHeight * i,
      }))
      .concat(
        range(0, 9).flatMap((i) => [
          {
            x1: left + stepWidth * i,
            x2: left + stepWidth * i,
            y1: top,
            y2: top + stepHeight * 4,
          },
          {
            x1: left + stepWidth * i,
            x2: left + stepWidth * i,
            y1: top + stepHeight * 5,
            y2: bottom,
          },
        ]),
        [
          {
            x1: left + stepWidth * 3,
            x2: left + stepWidth * 5,
            y1: top,
            y2: top + stepHeight * 2,
          },
          {
            x1: left + stepWidth * 3,
            x2: left + stepWidth * 5,
            y1: top + stepHeight * 2,
            y2: top,
          },
          {
            x1: left + stepWidth * 3,
            x2: left + stepWidth * 5,
            y1: bottom,
            y2: bottom - stepHeight * 2,
          },
          {
            x1: left + stepWidth * 3,
            x2: left + stepWidth * 5,
            y1: bottom - stepHeight * 2,
            y2: bottom,
          },
        ]
      )
  }

  draw() {
    this.drawBasic({
      type: 'line',
      key: 'line',
      data: [{data: this.lineData, ...this.style?.line}],
    })
    this.drawBasic({
      type: 'text',
      key: 'boardText',
      data: [{data: this.boardTextData, ...this.style?.text}],
    })
    this.drawBasic({
      type: 'circle',
      key: 'highlight',
      data: [{data: group(this.highlightChessData), ...this.style?.highlight}],
    })
    this.drawBasic({
      type: 'circle',
      key: 'chess',
      data: [{data: this.chessData, ...this.style?.chess}],
    })
    this.drawBasic({
      type: 'text',
      key: 'text',
      data: [
        {
          data: this.textData,
          ...this.style?.text,
          opacity: this.textData.map(({value}) => (value ? 1 : 0)),
        },
      ],
    })

    this.event.onWithOff('click-chess', 'internal', ({data}) => {
      const {role, position} = data.source.meta as ChineseSourceMeta

      if (this.disabled || !this.data) {
        this.focusPosition = null
        this.nextPosition = null
        return
      }

      if (isEqual(this.nextPosition, position)) {
        const board = cloneDeep(this.data.source)
        const focus = board.find(([x, y]) => isEqual([x, y], this.focusPosition))!
        const next = board.find(([x, y]) => isEqual([x, y], this.nextPosition))!
        const eaten = Object.values(ChineseChess).includes(next[3]) ? next[3] : null

        ;[next[2], next[3]] = [focus[2], focus[3]]
        ;[focus[2], focus[3]] = [Role.EMPTY, -1]

        this.disabled = true
        this.chessEvent.fire('chess', {
          prevPosition: this.focusPosition,
          nextPosition: position,
          eaten,
          board,
        } as ChinesePayload)
      } else if (
        this.focusPosition &&
        checkPlaceChineseChess({
          data: this.data!.source,
          prevPosition: this.focusPosition,
          nextPosition: position,
        })
      ) {
        this.nextPosition = position
      } else {
        this.focusPosition = null
        this.nextPosition = null
        if (role !== Role.EMPTY && role === this.role) {
          this.focusPosition = position
        }
      }

      this.needRecalculated = true
      this.draw()
    })
  }
}
