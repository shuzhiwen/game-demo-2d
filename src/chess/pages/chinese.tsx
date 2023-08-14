import {
  ChineseChess,
  ChinesePayload,
  RoleDict,
  boardId,
  replaceBoard,
  useChatMessage,
  useChessNavigate,
  useChessStorage,
  useCustomMutation,
  useHistoryData,
  useStaticRole,
} from '@chess/helper'
import {createChineseBoard} from '@chess/render'
import {LayerChineseChess} from '@chess/render/chinese'
import {AppStage, Background} from '@components'
import {Hourglass} from '@components/hourglass'
import {useDialog} from '@context'
import {useSound} from '@context/sound'
import {Backdrop, CircularProgress, Stack, Typography} from '@mui/material'
import {Chart} from 'awesome-chart'
import {useEffect, useRef, useState} from 'react'
import {useEffectOnce, useUpdateEffect} from 'react-use'
import {GameBar, UserStatus} from '../components'

export function ChineseStage() {
  const navigate = useChessNavigate()
  const {showDialog} = useDialog()
  const {role} = useChessStorage()
  const {anotherRole} = useStaticRole()
  const {setSound, setBackground} = useSound()
  const {appendChessMutation, exitMutation} = useCustomMutation()
  const {myMessage, otherMessage, setMessage} = useChatMessage()
  const chartRef = useRef<HTMLDivElement | null>(null)
  const [chart, setChart] = useState<Chart | null>(null)
  const {isMe, data, totalData, seq = 0} = useHistoryData({limit: 5})
  const currentRole = isMe ? role! : anotherRole

  useEffectOnce(() => {
    setBackground({type: 'hujiashibapai'})
  })

  useEffectOnce(() => {
    if (chartRef.current) {
      const chart = createChineseBoard({
        container: chartRef.current,
        role: role!,
      })
      setChart(chart)
      chart.draw()
    }
  })

  useEffect(() => {
    if (!chart) return

    const layer = chart.getLayerById(boardId) as LayerChineseChess

    layer.chessEvent.onWithOff('chess', 'user', (data) => {
      appendChessMutation(data, seq + 1)
    })
  }, [appendChessMutation, chart, seq])

  useUpdateEffect(() => {
    if (chart && data?.kind === 'chess') {
      const {board, eaten, nextPosition} = data.payload as ChinesePayload
      const layer = chart.getLayerById(boardId) as LayerChineseChess

      setSound({type: 'chess'})
      replaceBoard({chart, data: board, position: nextPosition})
      eaten && setMessage({isMe, content: '系统消息：吃！'})
      layer.disabled = isMe

      if (eaten === ChineseChess['KING']) {
        setTimeout(async () => {
          await exitMutation()
          setSound({type: isMe ? 'success' : 'fail'})
          showDialog({
            title: `${RoleDict[currentRole]}方获胜!`,
            onClose: () => navigate('login'),
          })
        })
      }
    }
  }, [data, chart])

  return (
    <AppStage>
      <Background />
      <GameBar />
      <Backdrop open={!chart && !totalData}>
        <Stack alignItems="center" spacing={2}>
          <Typography variant="h6">正在加载中...</Typography>
          <CircularProgress color="inherit" />
        </Stack>
      </Backdrop>
      <Stack flex={1} m={0} spacing={2} sx={{filter: chart ? '' : 'blur(5px)'}}>
        <Stack p={3}>
          <UserStatus align="left" role={anotherRole} message={otherMessage}>
            {isMe && <Hourglass />}
          </UserStatus>
        </Stack>
        <Stack ref={chartRef} className="fb1 fbjc fbac" />
        <Stack p={3}>
          <UserStatus align="right" role={role!} message={myMessage}>
            {!isMe && <Hourglass />}
          </UserStatus>
        </Stack>
      </Stack>
    </AppStage>
  )
}
