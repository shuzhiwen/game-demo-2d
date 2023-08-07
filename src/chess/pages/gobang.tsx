import {
  Role,
  RoleDict,
  boardId,
  decodeSource,
  useChatMessage,
  useChessNavigate,
  useChessStorage,
  useCustomMutation,
  useGobangInitialDataLazyQuery,
  useHistoryData,
} from '@chess/helper'
import {appendChess, appendFocusChess, appendReadyChess, createBoard} from '@chess/render'
import {isGobangChessWin} from '@chess/scripts'
import {AppStage, Background} from '@components'
import {Hourglass} from '@components/hourglass'
import {useDialog} from '@context'
import {useSound} from '@context/sound'
import {Backdrop, CircularProgress, Stack, Typography} from '@mui/material'
import {Chart, LayerScatter} from 'awesome-chart'
import {useEffect, useRef, useState} from 'react'
import {useEffectOnce, useUpdateEffect} from 'react-use'
import {GameBar, UserStatus} from '../components'

export function GobangStage() {
  const navigate = useChessNavigate()
  const {showDialog} = useDialog()
  const {role} = useChessStorage()
  const {setSound, setBackground} = useSound()
  const {myMessage, otherMessage} = useChatMessage()
  const queryInitialData = useGobangInitialDataLazyQuery()
  const chartRef = useRef<HTMLDivElement | null>(null)
  const [chart, setChart] = useState<Chart | null>(null)
  const {appendChessMutation, exitMutation} = useCustomMutation()
  const {isMe, data, seq = 0} = useHistoryData({limit: 5})
  const anotherRole = role === Role.WHITE ? Role.BLACK : Role.WHITE
  const currentRole = isMe ? role! : anotherRole

  useEffectOnce(() => {
    setBackground({type: 'hujiashibapai'})
  })

  useEffectOnce(() => {
    ;(async () => {
      if (chartRef.current) {
        const chart = createBoard({
          container: chartRef.current,
          initialData: await queryInitialData(),
        })
        setChart(chart)
        chart.draw()
      }
    })()
  })

  useEffect(() => {
    const event = chart?.getLayerById(boardId)?.event
    event?.onWithOff('click-point', 'user', async ({data}) => {
      if (isMe || !chart || !role) return

      const {position} = decodeSource(data.source)

      if (appendReadyChess({chart, role, position}) !== 'action') {
        return
      }

      const result = await appendChessMutation(position, seq + 1)

      if (!result?.data?.sendData) {
        showDialog({title: '连接服务器失败'})
      }
    })
  }, [isMe, chart, seq, role, appendChessMutation, showDialog])

  useUpdateEffect(() => {
    if (chart && data?.kind === 'chess') {
      const scatterLayer = chart.getLayerById(boardId) as LayerScatter
      const position = data.payload as Vec2

      setSound({type: 'chess'})
      appendChess({role: currentRole, chart, position})
      appendFocusChess({role: currentRole, chart, position})

      if (
        isGobangChessWin({
          data: scatterLayer.data!.rawTableListWithHeaders,
          position,
        })
      ) {
        setTimeout(async () => {
          await exitMutation()
          setSound({type: isMe ? 'success' : 'fail'})
          showDialog({
            title: `${RoleDict[currentRole]}子获胜!`,
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
