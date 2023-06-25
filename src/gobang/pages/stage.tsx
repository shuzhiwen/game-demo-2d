import {AppStage} from '@components'
import {useExitChannelMutation, useTransportSubscription} from '@generated/apollo'
import {Role, appendChess, boardId, createBoard, decodeSource} from '@gobang/render'
import {isCurrentChessWin} from '@gobang/scripts'
import {Stack, Typography} from '@mui/material'
import {Chart, LayerScatter} from 'awesome-chart'
import {ElSource} from 'awesome-chart/dist/types'
import {useEffect, useMemo, useRef, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {useEffectOnce, useLocalStorage} from 'react-use'
import {UserStatus} from './common'
import {GobangTransportData, useSendData} from './hooks'
import {GOBANG_CHANNEL, GOBANG_ROLE, GOBANG_USER} from './login'

export function GobangStage() {
  const navigate = useNavigate()
  const [role] = useLocalStorage<Role>(GOBANG_ROLE)
  const [userId] = useLocalStorage<string>(GOBANG_USER)
  const [channelId] = useLocalStorage<string>(GOBANG_CHANNEL)
  const [chart, setChart] = useState<Chart | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [exitMutation] = useExitChannelMutation()
  const {appendChessMutation} = useSendData()
  const {data: transportSubscription} = useTransportSubscription({
    skip: !channelId,
    variables: {channelId: channelId!},
  })
  const transport = transportSubscription?.transport as GobangTransportData
  const anotherRole = role === Role.WHITE ? Role.BLACK : Role.WHITE
  const currentRole = useMemo(() => {
    if (transport) {
      return transport.userId === userId ? role : anotherRole
    } else {
      return Role.WHITE
    }
  }, [anotherRole, transport, role, userId])

  useEffectOnce(() => {
    if (!role || !channelId) navigate('/gobang')
  })

  useEffectOnce(() => {
    if (containerRef.current) {
      const newChart = createBoard({container: containerRef.current})
      setChart(newChart)
    }
  })

  useEffect(() => {
    chart?.getLayerById(boardId)?.event.onWithOff('click-point', 'user', async ({data}) => {
      if (role === currentRole) return

      const source = data.source as ElSource[]
      const {category, x, y} = decodeSource(source)

      if (category === Role.EMPTY && channelId && userId) {
        const {data} = await appendChessMutation([x, y] as Vec2)

        if (!data?.sendData) {
          alert('连接服务器失败')
        }
      }
    })
  }, [appendChessMutation, channelId, chart, currentRole, role, userId])

  useEffect(() => {
    if (chart && currentRole && transport && channelId && userId) {
      const scatterLayer = chart.getLayerById(boardId) as LayerScatter
      const position = transport.data.payload as Vec2

      appendChess({role: currentRole, chart, position})

      if (
        isCurrentChessWin({
          data: scatterLayer.data!.rawTableListWithHeaders,
          position,
        })
      ) {
        setTimeout(() => {
          alert(`${currentRole == Role.WHITE ? '白' : '黑'}子获胜!`)
          exitMutation({variables: {input: {channelId, userId}}})
          navigate('/gobang')
        })
      }
    }
  }, [channelId, chart, currentRole, exitMutation, navigate, transport, userId])

  return (
    <Stack sx={{opacity: 0.2}}>
      <AppStage>
        <Stack flex={1} m={2} spacing={2}>
          <UserStatus align="left" role={anotherRole}>
            {role === currentRole && <Typography>思考中...</Typography>}
          </UserStatus>
          <Stack ref={containerRef} className="fb1 fbjc fbac" />
          <UserStatus align="right" role={role!}>
            {anotherRole == currentRole && <Typography>思考中...</Typography>}
          </UserStatus>
        </Stack>
      </AppStage>
    </Stack>
  )
}
