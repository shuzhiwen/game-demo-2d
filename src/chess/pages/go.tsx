import {
  GoPayload,
  Role,
  boardId,
  decodeSource,
  useChatMessage,
  useChessStorage,
  useCustomMutation,
  useHistoryData,
} from '@chess/helper'
import {
  appendFocusChess,
  appendReadyChess,
  createBoard,
  initialChess,
  replaceBoard,
} from '@chess/render'
import {checkAppendGoChess, checkEatGoChess, isGoBoardRepeat} from '@chess/scripts'
import {AppStage, Background} from '@components'
import {Hourglass} from '@components/hourglass'
import {useSnack} from '@context'
import {useSound} from '@context/sound'
import {Backdrop, CircularProgress, Stack, Typography} from '@mui/material'
import {Chart, LayerScatter} from 'awesome-chart'
import {useEffect, useRef, useState} from 'react'
import {useEffectOnce, useUpdateEffect} from 'react-use'
import {GameBar, UserStatus} from '../components'

export function GoStage() {
  const {showSnack} = useSnack()
  const {role} = useChessStorage()
  const {setSound, setBackground} = useSound()
  const {myMessage, otherMessage, setMessage} = useChatMessage()
  const chartRef = useRef<HTMLDivElement | null>(null)
  const [chart, setChart] = useState<Chart | null>(null)
  const {appendChessMutation} = useCustomMutation()
  const {isMe, data, totalData, seq = 0} = useHistoryData({limit: 5})
  const anotherRole = role === Role.WHITE ? Role.BLACK : Role.WHITE
  const currentRole = isMe ? role! : anotherRole

  useEffectOnce(() => {
    setBackground({type: 'hujiashibapai'})
  })

  useEffectOnce(() => {
    if (chartRef.current) {
      const chart = createBoard({
        container: chartRef.current,
        initialData: initialChess(),
      })
      setChart(chart)
      chart.draw()
    }
  })

  useEffect(() => {
    const event = chart?.getLayerById(boardId)?.event
    event?.onWithOff('click-point', 'user', async ({data}) => {
      if (isMe || !chart || !role) return

      const {position} = decodeSource(data.source)
      const layer = chart.getLayerById(boardId) as LayerScatter
      const tableList = layer.data!.rawTableListWithHeaders
      const {nextBoard, eaten} = checkEatGoChess({data: tableList, position, role})
      const {life} = checkAppendGoChess({data: tableList, position, role})

      if (!eaten && life === 0) {
        showSnack({message: '落子无气，请在选择其他位置'})
        return
      }
      if (isGoBoardRepeat({data: nextBoard, history: totalData})) {
        showSnack({message: '检测到打劫，禁止落子'})
        return
      }
      if (appendReadyChess({chart, role, position}) !== 'action') {
        return
      }

      await appendChessMutation({position, board: nextBoard, eaten}, seq + 1)
    })
  }, [appendChessMutation, chart, isMe, role, seq, showSnack, totalData])

  useUpdateEffect(() => {
    if (chart && data?.kind === 'chess') {
      const {position, board, eaten} = data.payload as GoPayload

      setSound({type: 'chess'})
      replaceBoard({chart, data: board})
      appendFocusChess({role: currentRole, chart, position})
      eaten && setMessage({isMe, content: '系统消息：吃！'})
    }
  }, [data, chart])

  return (
    <AppStage>
      <Background />
      <GameBar />
      <Backdrop open={!chart}>
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
