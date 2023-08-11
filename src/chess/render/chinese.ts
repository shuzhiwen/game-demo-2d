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
  LayerStyle,
  LineDrawerProps,
  TextDrawerProps,
  TextStyle,
} from 'awesome-chart/dist/types'
import {cloneDeep, isEqual, range} from 'lodash-es'

type DataKey = 'x' | 'y' | 'category' | 'chess'

type LayerScatterStyle = Partial<{
  chess: GraphStyle
  line: GraphStyle
  text: TextStyle
}>

export type ChineseSourceMeta = {
  focused: boolean
  chess: ChineseChess
  category: Role
  position: Vec2
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

export class LayerChineseChess extends LayerBase<BasicLayerOptions<any>> {
  chessEvent = new EventManager<'chess', 'user', (data: ChinesePayload) => void>(
    LayerChineseChess.name
  )

  data: Maybe<DataTableList>

  style: Maybe<LayerScatterStyle>

  role: Maybe<Role>

  disabled = false

  private focusPosition: Maybe<Vec2>

  private nextPosition: Maybe<Vec2>

  private boardLineData: DrawerData<LineDrawerProps>[] = []

  private boardTextData: (DrawerData<TextDrawerProps> & {
    meta?: ChineseSourceMeta
  })[] = []

  private boardChessData: (DrawerData<CircleDrawerProps> & {
    meta: ChineseSourceMeta
  })[] = []

  constructor(options: BasicLayerOptions<any>, context: ChartContext) {
    super({context, options, sublayers: ['line', 'text', 'chess']})
    this.needRecalculated = true
  }

  setData(data: LayerScatter['data']) {
    this.data = validateAndCreateData('tableList', this.data, data)
    checkColumns(this.data, ['x', 'y', 'category', 'chess'])
    this.focusPosition = null
    this.nextPosition = null
  }

  setStyle(style: LayerStyle<LayerChineseChess['style']>) {
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

    this.boardChessData = data.map(({x, y, category, chess}) => ({
      r: chessSize,
      x: left + x * stepWidth,
      y: top + y * stepHeight,
      meta: {
        chess,
        category,
        position: [x, y],
        focused: isEqual(this.focusPosition, [x, y]),
      },
    }))

    if (this.nextPosition && this.focusPosition) {
      const focus = this.boardChessData.find(({meta}) => {
        return isEqual(meta.position, this.focusPosition)
      })!
      const next = this.boardChessData.find(({meta}) => {
        return isEqual(meta.position, this.nextPosition)
      })!
      next.meta = {...focus.meta, position: next.meta.position}
      focus.meta = {...focus.meta, category: Role.EMPTY}
    }

    this.boardTextData = this.boardChessData.map((item) =>
      createText({
        ...item,
        style: this.style?.text,
        value: ChineseChessDict[item.meta.chess]?.[item.meta.category],
        position: 'center',
      })
    )
    this.boardTextData.push(
      createText({
        x: left + width / 4,
        y: top + height / 2,
        value: 'ChuHe',
        position: 'center',
      }),
      createText({
        x: right - width / 4,
        y: top + height / 2,
        value: 'HanJie',
        position: 'center',
      })
    )
    this.boardLineData = range(0, 10)
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
      data: [{data: this.boardLineData, ...this.style?.line}],
    })
    this.drawBasic({
      type: 'circle',
      data: [{data: this.boardChessData, ...this.style?.chess}],
      sublayer: 'chess',
    })
    this.drawBasic({
      type: 'text',
      data: [
        {
          data: this.boardTextData,
          ...this.style?.text,
          opacity: this.boardTextData.map(({value}) => (value ? 1 : 0)),
        },
      ],
    })
    this.event.onWithOff('click-chess', 'internal', ({data}) => {
      const {category, position} = data.source.meta as ChineseSourceMeta

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
        if (category !== Role.EMPTY && category === this.role) {
          this.focusPosition = position
        }
      }

      this.needRecalculated = true
      this.draw()
    })
  }
}
