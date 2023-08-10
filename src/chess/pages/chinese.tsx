import {Role, useChatMessage, useChessStorage, useHistoryData} from '@chess/helper'
import {createChineseBoard} from '@chess/render'
import {AppStage, Background} from '@components'
import {Hourglass} from '@components/hourglass'
import {useSound} from '@context/sound'
import {Backdrop, CircularProgress, Stack, Typography} from '@mui/material'
import {Chart} from 'awesome-chart'
import {useRef, useState} from 'react'
import {useEffectOnce} from 'react-use'
import {GameBar, UserStatus} from '../components'

export function ChineseStage() {
  const {role} = useChessStorage()
  const {setBackground} = useSound()
  const {myMessage, otherMessage} = useChatMessage()
  const chartRef = useRef<HTMLDivElement | null>(null)
  const [chart, setChart] = useState<Chart | null>(null)
  const {isMe} = useHistoryData({limit: 5})
  const anotherRole = role === Role.WHITE ? Role.BLACK : Role.WHITE

  useEffectOnce(() => {
    setBackground({type: 'hujiashibapai'})
  })

  useEffectOnce(() => {
    if (chartRef.current) {
      const chart = createChineseBoard({
        container: chartRef.current,
      })
      setChart(chart)
      chart.draw()
    }
  })

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
