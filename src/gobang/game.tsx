import {AppStage} from '@components'
import {Stack} from '@mui/material'
import {Chart, LayerScatter} from 'awesome-chart'
import {ElSource} from 'awesome-chart/dist/types'
import {useEffect, useRef, useState} from 'react'
import {Chess, appendChess, boardId, createBoard, decodeSource} from './render'
import {isCurrentChessWin} from './scripts'

export function Gobang() {
  const ref = useRef<HTMLDivElement>(null)
  const [chart, setChart] = useState<Chart | null>(null)
  const [role, setRole] = useState<Exclude<Chess, Chess.EMPTY>>(Chess.BLACK)

  useEffect(() => {
    const container = ref.current!
    const chart = createBoard({container})
    setChart(chart)
    return () => chart.destroy()
  }, [])

  useEffect(() => {
    const scatterLayer = chart?.getLayerById(boardId) as LayerScatter
    scatterLayer?.event.onWithOff('click-point', 'user', ({data}) => {
      const source = data.source as ElSource[]
      const {category, x, y} = decodeSource(source)
      if (category === Chess.EMPTY) {
        appendChess({role: role, source, chart: chart!})
        setRole(role === Chess.BLACK ? Chess.WHITE : Chess.BLACK)
        if (
          isCurrentChessWin({
            data: scatterLayer.data!.rawTableListWithHeaders,
            position: [x, y] as Vec2,
          })
        ) {
          setTimeout(() => {
            alert(`${role == Chess.WHITE ? 'White' : 'Black'} Chess Win!`)
          })
        }
      }
    })
  }, [chart, role])

  return (
    <AppStage>
      <Stack ref={ref} m={2} className="fb1 fbjc fbac" sx={{opacity: 0.2}} />
    </AppStage>
  )
}
