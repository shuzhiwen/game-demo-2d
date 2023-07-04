import {AppStage, Background} from '@components'
import {useSound} from '@context/sound'
import {Role} from '@gobang/render'
import {CheckRounded} from '@mui/icons-material'
import {Stack, Typography} from '@mui/material'
import {useEffect, useMemo} from 'react'
import {useEffectOnce, useLocalStorage} from 'react-use'
import {GameBar, UserStatus} from './common'
import {GOBANG_ROLE} from './constants'
import {useCustomMutation, useGobangNavigate, useHistoryData} from './hooks'

export function GobangPrepare() {
  const navigate = useGobangNavigate()
  const {playBackground} = useSound()
  const [role] = useLocalStorage<Role>(GOBANG_ROLE)
  const {prepareMutation} = useCustomMutation()
  const anotherRole = role === Role.WHITE ? Role.BLACK : Role.WHITE
  const {totalData, seq = 0} = useHistoryData()
  const gameReady = useMemo(() => {
    const prepareData = totalData.filter(({data}) => data.kind === 'prepare')
    return new Set(prepareData.map(({userId}) => userId)).size
  }, [totalData])

  useEffectOnce(() => {
    playBackground({type: 'kisstherain'})
    prepareMutation(seq + 1)
  })

  useEffect(() => {
    if (gameReady >= 2) {
      setTimeout(() => navigate('stage'), 1000)
    }
  }, [gameReady, navigate])

  return (
    <AppStage>
      <Background />
      <GameBar />
      <Stack width={200} m="auto" spacing={4}>
        <UserStatus align="left" role={anotherRole}>
          {gameReady >= 2 && (
            <Stack direction="row" spacing={1} alignItems="center">
              <CheckRounded sx={{color: 'lightgreen', fontSize: 36}} />
              <Typography>已就绪</Typography>
            </Stack>
          )}
        </UserStatus>
        <UserStatus align="left" role={role!}>
          {gameReady >= 1 && (
            <Stack direction="row" spacing={1} alignItems="center">
              <CheckRounded sx={{color: 'lightgreen', fontSize: 36}} />
              <Typography>已就绪</Typography>
            </Stack>
          )}
        </UserStatus>
      </Stack>
    </AppStage>
  )
}
