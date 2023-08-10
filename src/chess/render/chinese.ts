import {ChineseChess, ChineseChessDict, Role} from '@chess/helper'
import {
  Chart,
  DataTableList,
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
import {range} from 'lodash-es'

export function createChineseChessLayer(
  chart: Chart,
  options: Omit<LayerScatterOptions, 'type'>
): LayerChineseChess {
  if (!Object.keys(LayerDict).includes('chineseChess')) {
    registerCustomLayer('chineseChess', LayerChineseChess)
  }

  return chart.createLayer({...options, type: 'chineseChess' as any})
}

type DataKey = 'x' | 'y' | 'category' | 'chess'

type LayerScatterStyle = Partial<{
  chess: GraphStyle
  line: GraphStyle
  text: TextStyle
}>

class LayerChineseChess extends LayerBase<BasicLayerOptions<any>> {
  data: Maybe<DataTableList>

  style: Maybe<LayerScatterStyle>

  private boardLineData: DrawerData<LineDrawerProps>[] = []

  private boardTextData: (DrawerData<TextDrawerProps> & {
    meta?: {chess: ChineseChess; category: Extract<Role, Role.BLACK | Role.RED>}
  })[] = []

  private boardChessData: (DrawerData<CircleDrawerProps> & {
    meta: {chess: ChineseChess; category: Extract<Role, Role.BLACK | Role.RED>}
  })[] = []

  constructor(options: BasicLayerOptions<any>, context: ChartContext) {
    super({context, options, sublayers: ['line', 'text', 'chess']})
    this.needRecalculated = true
  }

  setData(data: LayerScatter['data']) {
    this.data = validateAndCreateData('tableList', this.data, data)
    checkColumns(this.data, ['x', 'y', 'category', 'chess'])
  }

  setStyle(style: LayerStyle<LayerChineseChess['style']>) {
    this.style = createStyle(this.options, {}, this.style ?? {}, style)
  }

  update() {
    if (!this.data) throw new Error('There is not data available!')

    const {layout} = this.options
    const data = tableListToObjects<DataKey, number>(this.data.source)
    const {top, left, width, height, right, bottom} = layout
    const [stepWidth, stepHeight] = [width / 8, height / 9]
    const chessSize = Math.max(stepWidth, stepHeight) / 2.8

    this.boardChessData = data.map(({x, y, category, chess}) => ({
      x: left + x * stepWidth,
      y: top + y * stepHeight,
      meta: {chess, category},
      r: chessSize,
    }))
    this.boardTextData = this.boardChessData.map((item) =>
      createText({
        ...item,
        style: this.style?.text,
        value: ChineseChessDict[item.meta.chess][item.meta.category],
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
      data: [{data: this.boardTextData, ...this.style?.text}],
    })
  }
}
