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
import {checkAppendGoChess, checkEatGoChess} from '@chess/scripts'
import {AppStage, Background} from '@components'
import {Hourglass} from '@components/hourglass'
import {useDialog, useSnack} from '@context'
import {useSound} from '@context/sound'
import {Backdrop, CircularProgress, Stack, Typography} from '@mui/material'
import {Chart, LayerScatter} from 'awesome-chart'
import {ElSource} from 'awesome-chart/dist/types'
import {useEffect, useRef, useState} from 'react'
import {useEffectOnce, useUpdateEffect} from 'react-use'
import {GameBar, UserStatus} from '../components'

export function GoStage() {
  const {showSnack} = useSnack()
  const {showDialog} = useDialog()
  const {role} = useChessStorage()
  const {playSound, playBackground} = useSound()
  const {myMessage, otherMessage, setMessage} = useChatMessage()
  const chartRef = useRef<HTMLDivElement | null>(null)
  const [chart, setChart] = useState<Chart | null>(null)
  const {appendChessMutation} = useCustomMutation()
  const {isMe, data, seq = 0} = useHistoryData({limit: 10})
  const anotherRole = role === Role.WHITE ? Role.BLACK : Role.WHITE
  const currentRole = isMe ? role! : anotherRole

  useEffectOnce(() => {
    playBackground({type: 'hujiashibapai'})
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

      const source = data.source as ElSource[]
      const {x, y} = decodeSource(source)
      const layer = chart.getLayerById(boardId) as LayerScatter
      const tableList = layer.data!.rawTableListWithHeaders
      const position = [x, y] as Vec2

      if (checkAppendGoChess({data: tableList, position, role}).life === 0) {
        showSnack({message: '落子无气，请选择另一处'})
        return
      }
      if (appendReadyChess({chart, role, position}) !== 'action') {
        return
      }

      const {newBoard, eaten} = checkEatGoChess({data: tableList, position, role})
      const result = await appendChessMutation(
        {position: [x, y], board: newBoard, eaten} as GoPayload,
        (seq ?? 0) + 1
      )

      if (!result?.data?.sendData) {
        showDialog({title: '连接服务器失败'})
      }
    })
  }, [appendChessMutation, chart, isMe, role, seq, showDialog, showSnack])

  useUpdateEffect(() => {
    if (chart && data?.kind === 'chess') {
      const {position, board, eaten} = data.payload as GoPayload

      playSound({type: 'chess'})
      replaceBoard({chart, data: board})
      appendFocusChess({role: currentRole, chart, position})

      if (eaten) {
        setMessage({isMe, content: '系统消息：吃！'})
      }
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
