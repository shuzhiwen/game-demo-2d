import {
  ChineseChess,
  ChineseChessDict,
  ChinesePayload,
  Role,
} from '@chess/helper'
import {checkPlaceChineseChess} from '@chess/scripts'
import {
  DataTableList,
  EventManager,
  LayerBase,
  LayerScatter,
  checkColumns,
  createData,
  createStyle,
  createText,
  elClass,
  group,
  selector,
  tableListToObjects,
  ungroup,
} from 'awesome-chart'
import {
  D3Selection,
  DrawerData,
  EllipseDrawerProps,
  GraphStyle,
  LayerOptions,
  LineDrawerProps,
  PathDrawerProps,
  TextDrawerProps,
  TextStyle,
} from 'awesome-chart/dist/types'
import chroma from 'chroma-js'
import {cloneDeep, isEqual, range} from 'lodash-es'
import {addLightForElement, addShadowForContainer} from './filter'

type Key = 'line' | 'text' | 'boardText' | 'chess' | 'highlight' | 'bg1' | 'bg2'

type DataKey = 'x' | 'y' | 'role' | 'chess'

type LayerStyle = Partial<{
  highlight: GraphStyle
  chess: GraphStyle
  line: GraphStyle
  text: TextStyle
}>

type ChineseSourceMeta = {
  focused: boolean
  chess: ChineseChess
  position: Vec2
  role: Role
}

export class LayerChineseChess extends LayerBase<Key> {
  chessEvent = new EventManager<'chess', (data: ChinesePayload) => void>()

  data: Maybe<DataTableList>

  style: LayerStyle = {}

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

  private chessData: (DrawerData<EllipseDrawerProps> & {
    meta: ChineseSourceMeta
  })[] = []

  private highlightChessData: Maybe<DrawerData<EllipseDrawerProps>>

  private bg1Data: DrawerData<EllipseDrawerProps>[] = []

  private bg2Data: DrawerData<PathDrawerProps>[] = []

  constructor(options: LayerOptions) {
    const boardKey = ['line', 'boardText'] as const
    const chessKey = ['text', 'chess', 'highlight', 'bg1', 'bg2'] as const
    super({options, sublayers: [...boardKey, ...chessKey]})
    this.needRecalculated = true
    this.systemEvent.once('draw', 'shadow', () => {
      addShadowForContainer(
        selector.getDirectChild(
          this.root as D3Selection,
          `${this.className}-bg2`
        )
      )
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
        const focus = board.find(([x, y]) =>
          isEqual([x, y], this.focusPosition)
        )!
        const next = board.find(([x, y]) => isEqual([x, y], this.nextPosition))!
        const eaten = Object.values(ChineseChess).includes(next[3])
          ? next[3]
          : null

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

  setData(data: LayerScatter['data']) {
    this.data = createData('tableList', this.data, data)
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
    const chessSize = Math.min(stepWidth, stepHeight) / 2.4

    this.chessData = data.map(({x, y, role, chess}) => ({
      rx: chessSize,
      ry: chessSize - 2,
      cx: left + x * stepWidth,
      cy: top + y * stepHeight - 4,
      meta: {
        chess,
        role,
        position: [x, y],
        focused: isEqual(this.focusPosition, [x, y]),
      },
    }))
    this.highlightChessData = this.chessData.find(({meta}) =>
      isEqual(meta.position, this.highlightPosition)
    ) || {cx: -100, cy: -100, rx: 0, ry: 0}

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

    this.bg1Data = this.chessData
      .filter(({meta}) => meta.role !== Role.EMPTY)
      .map(({rx, ry, ...rest}) => ({
        ...rest,
        rx: rx + 2,
        ry: ry + 2,
      }))
    this.bg2Data = this.bg1Data.map(({cx, cy, rx}) => ({
      path: `M ${cx - rx},${cy} A ${rx + 1},${rx - 1},0,1,0,${cx + rx},${cy} Z`,
    }))
    this.textData = this.chessData.map(({cx, cy, meta}) =>
      createText({
        x: cx,
        y: cy,
        style: this.style?.text,
        value: ChineseChessDict[meta.chess]?.[meta.role],
        position: 'center',
        meta,
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
    const {line, text, chess, highlight} = this.style

    this.drawBasic({
      type: 'line',
      key: 'line',
      data: [{data: this.lineData, ...line}],
    })
    this.drawBasic({
      type: 'text',
      key: 'boardText',
      data: [{data: this.boardTextData, ...text}],
    })
    this.drawBasic({
      type: 'path',
      key: 'bg2',
      data: [
        {
          data: this.bg2Data,
          fill: chroma(ungroup(chess?.fill) ?? '#00000000')
            .darken(1)
            .hex(),
        },
      ],
    })
    this.drawBasic({
      type: 'ellipse',
      key: 'bg1',
      data: [{data: this.bg1Data, fill: chess?.fill}],
    })
    this.drawBasic({
      type: 'ellipse',
      key: 'chess',
      data: [{data: this.chessData, ...chess}],
    })
    this.drawBasic({
      type: 'ellipse',
      key: 'highlight',
      data: [
        {evented: false, data: group(this.highlightChessData), ...highlight},
      ],
    })
    this.drawBasic({
      type: 'text',
      key: 'text',
      data: [{data: this.textData, ...text}],
    })

    selector
      .getChildren(this.root as D3Selection, elClass('chess'))
      .each(addLightForElement as any)
  }
}
