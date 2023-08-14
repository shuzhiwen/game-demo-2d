import {
  GobangPayload,
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
import {createBoard} from '@chess/render'
import {LayerCommonChess} from '@chess/render/chess'
import {isGobangChessWin} from '@chess/scripts'
import {AppStage, Background} from '@components'
import {Hourglass} from '@components/hourglass'
import {useDialog} from '@context'
import {useSound} from '@context/sound'
import {Backdrop, CircularProgress, Stack, Typography} from '@mui/material'
import {Chart} from 'awesome-chart'
import {isEqual} from 'lodash-es'
import {useEffect, useRef, useState} from 'react'
import {useEffectOnce, useUpdateEffect} from 'react-use'
import {GameBar, UserStatus} from '../components'

export function GobangStage() {
  const navigate = useChessNavigate()
  const {role} = useChessStorage()
  const {showDialog} = useDialog()
  const {anotherRole} = useStaticRole()
  const {setSound, setBackground} = useSound()
  const {myMessage, otherMessage} = useChatMessage()
  const chartRef = useRef<HTMLDivElement | null>(null)
  const [chart, setChart] = useState<Chart | null>(null)
  const {appendChessMutation, exitMutation} = useCustomMutation()
  const {isMe, data, totalData, seq = 0} = useHistoryData({limit: 5})
  const currentRole = isMe ? role! : anotherRole

  useEffectOnce(() => {
    setBackground({type: 'hujiashibapai'})
  })

  useEffectOnce(() => {
    ;(async () => {
      if (chartRef.current) {
        const chart = createBoard({
          container: chartRef.current,
          role: role!,
        })
        setChart(chart)
        chart.draw()
      }
    })()
  })

  useEffect(() => {
    if (!chart || !role) return

    const layer = chart.getLayerById(boardId) as LayerCommonChess

    layer.chessEvent.onWithOff('chess', 'user', async ({position, board}) => {
      board.find(([x, y]) => isEqual([x, y], position))![2] = role
      await appendChessMutation({position, board}, seq + 1)
    })
  }, [appendChessMutation, chart, isMe, role, seq])

  useUpdateEffect(() => {
    if (chart && data?.kind === 'chess') {
      const {position, board} = data.payload as GobangPayload
      const layer = chart.getLayerById(boardId) as LayerCommonChess

      setSound({type: 'chess'})
      replaceBoard({chart, data: board, position})
      layer.disabled = isMe

      if (isGobangChessWin({data: board, position})) {
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
