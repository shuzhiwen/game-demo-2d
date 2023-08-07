import {
  Chart,
  LayerDict,
  LayerScatter,
  registerCustomLayer,
  tableListToObjects,
  ungroup,
} from 'awesome-chart'
import {
  CircleDrawerProps,
  DrawerData,
  LayerScatterOptions,
  SourceMeta,
} from 'awesome-chart/dist/types'

type DataKey = 'x' | 'y' | 'value' | 'category'

class LayerChess extends LayerScatter {
  private chessData: (DrawerData<CircleDrawerProps> & {
    value: Meta
    category: Meta
    meta: SourceMeta
  })[] = []

  update() {
    if (!this.data || !this.scale) {
      throw new Error('Invalid data or scale')
    }

    const {pointSize} = this.style,
      {top, left} = this.options.layout,
      {scaleX, scaleY, scalePointSize} = this.scale,
      data = tableListToObjects<DataKey>(this.data.source)

    this.chessData = data.map((datum) => ({
      value: datum.value,
      category: datum.category,
      x: left + scaleX(datum.x as number) ?? NaN,
      y: top + scaleY(datum.y as number) ?? NaN,
      r: scalePointSize(datum.value as number) ?? ungroup(pointSize),
      meta: {...datum, dimension: `${datum.x}-${datum.y}`},
    }))
  }

  draw() {
    this.drawBasic({
      type: 'circle',
      data: [{data: this.chessData, ...this.style.point}],
      sublayer: 'point',
    })
  }
}

if (!Object.keys(LayerDict).includes('chess')) {
  registerCustomLayer('chess', LayerChess)
}

export function createChessLayer(chart: Chart, options: Omit<LayerScatterOptions, 'type'>) {
  return chart.createLayer({...options, type: 'chess' as any}) as LayerChess
}
