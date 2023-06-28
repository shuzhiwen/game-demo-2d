import {AppStage} from '@components'
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
import {GOBANG_CHANNEL, GOBANG_ROLE, GOBANG_USER} from './login'

export function GobangStage() {
  const navigate = useNavigate()
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [role] = useLocalStorage<Role>(GOBANG_ROLE)
  const [userId] = useLocalStorage<string>(GOBANG_USER)
  const [channelId] = useLocalStorage<string>(GOBANG_CHANNEL)
  const [chart, setChart] = useState<Chart | null>(null)
  const {appendChessMutation, exitMutation} = useCustomMutation()
  const {isMe, data} = useHistoryData({limit: 1})
  const anotherRole = role === Role.WHITE ? Role.BLACK : Role.WHITE
  const currentRole = isMe ? role! : anotherRole

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
    const event = chart?.getLayerById(boardId)?.event
    const listener = async ({data}: any) => {
      if (isMe) return

      const source = data.source as ElSource[]
      const {category, x, y} = decodeSource(source)

      if (category === Role.EMPTY && channelId && userId) {
        const {data} = await appendChessMutation([x, y] as Vec2)

        if (!data?.sendData) {
          alert('连接服务器失败')
        }
      }
    }
    event?.onWithOff('click-point', 'user', listener)
    return () => event?.off('click-point')
  }, [appendChessMutation, channelId, chart, isMe, userId])

  useEffect(() => {
    if (chart && data?.kind === 'chess') {
      const scatterLayer = chart.getLayerById(boardId) as LayerScatter
      const position = data?.payload as Vec2

      appendChess({role: currentRole, chart, position})

      if (
        isCurrentChessWin({
          data: scatterLayer.data!.rawTableListWithHeaders,
          position,
        })
      ) {
        setTimeout(() => {
          alert(`${RoleDict[currentRole]}子获胜!`)
          navigate('/gobang')
          exitMutation()
        })
      }
    }
  }, [chart, currentRole, data, exitMutation, navigate])

  return (
    <Stack sx={{opacity: 0.2}}>
      <AppStage>
        <Stack flex={1} m={2} spacing={2}>
          <UserStatus align="left" role={anotherRole}>
            {isMe && <Typography>思考中...</Typography>}
          </UserStatus>
          <Stack ref={containerRef} className="fb1 fbjc fbac" />
          <UserStatus align="right" role={role!}>
            {!isMe && <Typography>思考中...</Typography>}
          </UserStatus>
        </Stack>
      </AppStage>
    </Stack>
  )
}
