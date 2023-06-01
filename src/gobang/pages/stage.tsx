import {AppStage} from '@components'
import {
  useExitChannelMutation,
  useSendDataMutation,
  useTransportSubscription,
} from '@generated/apollo'
import {Role, appendChess, boardId, createBoard, decodeSource} from '@gobang/render'
import {isCurrentChessWin} from '@gobang/scripts'
import {Stack} from '@mui/material'
import {Chart, LayerScatter, uuid} from 'awesome-chart'
import {ElSource} from 'awesome-chart/dist/types'
import {useEffect, useMemo, useRef, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {useLocalStorage} from 'react-use'
import {GOBANG_CHANNEL, GOBANG_ROLE, GOBANG_USER} from './login'

export function GobangStage() {
  const navigate = useNavigate()
  const [role] = useLocalStorage<Role>(GOBANG_ROLE)
  const [userId] = useLocalStorage(GOBANG_USER, uuid())
  const [channelId] = useLocalStorage<string>(GOBANG_CHANNEL)
  const [chart, setChart] = useState<Chart | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [sendMutation] = useSendDataMutation()
  const [exitMutation] = useExitChannelMutation()
  const {data} = useTransportSubscription({
    skip: !channelId,
    variables: {channelId: channelId!},
  })
  const currentRole = useMemo(() => {
    const anotherRole = role === Role.WHITE ? Role.BLACK : Role.WHITE
    if (data) {
      return data.transport.userId === userId ? role : anotherRole
    } else {
      return Role.WHITE
    }
  }, [data, role, userId])

  useEffect(() => {
    if (!role || !channelId) navigate('/gobang')
  }, [channelId, navigate, role])

  useEffect(() => {
    if (containerRef.current) {
      const newChart = createBoard({container: containerRef.current})
      setChart(newChart)
    }
  }, [])

  useEffect(() => {
    const layer = chart?.getLayerById(boardId)
    if (role === currentRole) {
      layer?.event.off('click-point')
    } else {
      layer?.event.onWithOff('click-point', 'user', async ({data}) => {
        const source = data.source as ElSource[]
        const {category, x, y} = decodeSource(source)
        if (category === Role.EMPTY && channelId && userId) {
          const {data} = await sendMutation({
            variables: {input: {channelId, userId, data: [x, y]}},
          })
          if (!data?.sendData) {
            alert('连接服务器失败')
          }
        }
      })
    }
  }, [channelId, chart, currentRole, role, sendMutation, userId])

  useEffect(() => {
    if (chart && currentRole && data && channelId && userId) {
      const scatterLayer = chart.getLayerById(boardId) as LayerScatter
      appendChess({role: currentRole, chart, position: data.transport.data})
      if (
        isCurrentChessWin({
          data: scatterLayer.data!.rawTableListWithHeaders,
          position: data.transport.data,
        })
      ) {
        setTimeout(() => {
          alert(`${currentRole == Role.WHITE ? '白' : '黑'}子获胜!`)
          exitMutation({variables: {input: {channelId, userId}}})
          navigate('/gobang')
        })
      }
    }
  }, [channelId, chart, currentRole, data, exitMutation, navigate, userId])

  return (
    <Stack sx={{opacity: 0.2}}>
      <AppStage>
        <Stack m={2} ref={containerRef} className="fb1 fbjc fbac" />
      </AppStage>
    </Stack>
  )
}
