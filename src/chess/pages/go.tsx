import {
  GoPayload,
  boardId,
  replaceBoard,
  useChatMessage,
  useChessStorage,
  useCustomMutation,
  useHistoryData,
  useStaticRole,
} from '@chess/helper'
import {LayerChineseChess, createBoard} from '@chess/render'
import {LayerChess} from '@chess/render/chess'
import {
  checkAppendGoChess,
  checkEatGoChess,
  isGoBoardRepeat,
} from '@chess/scripts'
import {AppStage, Background} from '@components'
import {Hourglass} from '@components/hourglass'
import {useSnack} from '@context'
import {useSound} from '@context/sound'
import {Backdrop, CircularProgress, Stack, Typography} from '@mui/material'
import {Chart} from 'awesome-chart'
import {useEffect, useRef, useState} from 'react'
import {useEffectOnce, useUpdateEffect} from 'react-use'
import {GameBar, UserStatus} from '../components'

export function GoStage() {
  const {showSnack} = useSnack()
  const {role} = useChessStorage()
  const {anotherRole} = useStaticRole()
  const {setSound, setBackground} = useSound()
  const {myMessage, otherMessage, setMessage} = useChatMessage()
  const chartRef = useRef<HTMLDivElement | null>(null)
  const [chart, setChart] = useState<Chart | null>(null)
  const {appendChessMutation} = useCustomMutation()
  const {isMe, data, totalData, seq = 0} = useHistoryData({limit: 5})

  useEffectOnce(() => {
    setBackground({type: 'hujiashibapai'})
  })

  useEffectOnce(() => {
    if (chartRef.current) {
      const chart = createBoard({
        container: chartRef.current,
        role: role!,
      })
      setChart(chart)
      chart.draw()
    }
  })

  useEffect(() => {
    if (!chart || !role) return

    const layer = chart.getLayerById(boardId) as LayerChess

    layer.chessEvent.onWithOff('chess', 'user', async (data) => {
      const {position, board} = data
      const {nextBoard, eaten} = checkEatGoChess({data: board, position, role})
      const {life} = checkAppendGoChess({data: board, position, role})
      const layer = chart.getLayerById(boardId) as LayerChineseChess

      if (!eaten && life === 0) {
        showSnack({message: '落子无气，请在选择其他位置'})
        layer.disabled = false
        return
      }
      if (isGoBoardRepeat({data: nextBoard, history: totalData})) {
        showSnack({message: '检测到打劫，禁止落子'})
        layer.disabled = false
        return
      }

      await appendChessMutation({position, board: nextBoard, eaten}, seq + 1)
    })
  }, [appendChessMutation, chart, role, seq, showSnack, totalData])

  useUpdateEffect(() => {
    if (chart && data?.kind === 'chess') {
      const {position, board, eaten} = data.payload as GoPayload
      const layer = chart.getLayerById(boardId) as LayerChineseChess

      setSound({type: 'chess'})
      replaceBoard({chart, data: board, position})
      eaten && setMessage({isMe, content: '系统消息：吃！'})
      layer.disabled = isMe
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
