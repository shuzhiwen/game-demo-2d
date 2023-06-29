import {AppStage, Background} from '@components'
import {useDialog} from '@context'
import {useSound} from '@context/sound'
import {Role, appendChess, boardId, createBoard, decodeSource} from '@gobang/render'
import {isCurrentChessWin} from '@gobang/scripts'
import {Stack, Typography} from '@mui/material'
import {Chart, LayerScatter} from 'awesome-chart'
import {ElSource} from 'awesome-chart/dist/types'
import {useEffect, useRef, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {useEffectOnce, useLocalStorage} from 'react-use'
import {RoleDict, UserStatus} from './common'
import {useCustomMutation, useHistoryData} from './hooks'
import {GOBANG_CHANNEL, GOBANG_ROLE} from './login'

export function GobangStage() {
  const navigate = useNavigate()
  const {notice} = useDialog()
  const {playSound, playBackground} = useSound()
  const [role] = useLocalStorage<Role>(GOBANG_ROLE)
  const [channelId] = useLocalStorage<string>(GOBANG_CHANNEL)
  const [chart, setChart] = useState<Chart | null>(null)
  const {appendChessMutation, exitMutation} = useCustomMutation()
  const {isMe, data} = useHistoryData({limit: 1})
  const chartRef = useRef<HTMLDivElement | null>(null)
  const anotherRole = role === Role.WHITE ? Role.BLACK : Role.WHITE
  const currentRole = isMe ? role! : anotherRole

  useEffectOnce(() => {
    if (!role || !channelId) {
      navigate('/gobang')
    } else {
      playBackground({type: 'hujiashibapai'})
    }
  })

  useEffectOnce(() => {
    if (chartRef.current) {
      const chart = createBoard({container: chartRef.current})
      setChart(chart)
      chart.draw()
    }
  })

  useEffect(() => {
    const event = chart?.getLayerById(boardId)?.event
    const listener = async ({data}: any) => {
      if (isMe) return

      const source = data.source as ElSource[]
      const {category, x, y} = decodeSource(source)

      if (category === Role.EMPTY) {
        const {data} = await appendChessMutation([x, y] as Vec2)

        if (!data?.sendData) {
          notice({title: '连接服务器失败'})
        }
      }
    }
    event?.onWithOff('click-point', 'user', listener)
    return () => event?.off('click-point')
  }, [appendChessMutation, chart, isMe, notice])

  useEffect(() => {
    if (chart && data?.kind === 'chess') {
      const scatterLayer = chart.getLayerById(boardId) as LayerScatter
      const position = data?.payload as Vec2

      appendChess({role: currentRole, chart, position})
      playSound({type: 'chess'})

      if (
        isCurrentChessWin({
          data: scatterLayer.data!.rawTableListWithHeaders,
          position,
        })
      ) {
        setTimeout(() => {
          exitMutation()
          playSound({type: isMe ? 'success' : 'fail'})
          notice({
            title: `${RoleDict[currentRole]}子获胜!`,
            onClose: () => navigate('/gobang'),
          })
        })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  return (
    <AppStage>
      <Background />
      <Stack flex={1} m={0} spacing={2}>
        <Stack p={2}>
          <UserStatus align="left" role={anotherRole}>
            {isMe && <Typography>思考中...</Typography>}
          </UserStatus>
        </Stack>
        <Stack ref={chartRef} className="fb1 fbjc fbac" />
        <Stack p={2}>
          <UserStatus align="right" role={role!}>
            {!isMe && <Typography>思考中...</Typography>}
          </UserStatus>
        </Stack>
      </Stack>
    </AppStage>
  )
}
