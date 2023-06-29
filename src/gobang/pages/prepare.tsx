import {AppStage, Background} from '@components'
import {useSound} from '@context/sound'
import {Role} from '@gobang/render'
import {CheckRounded} from '@mui/icons-material'
import {Stack, Typography} from '@mui/material'
import {useEffect, useMemo} from 'react'
import {useNavigate} from 'react-router-dom'
import {useEffectOnce, useLocalStorage} from 'react-use'
import {UserStatus} from './common'
import {useCustomMutation, useHistoryData} from './hooks'
import {GOBANG_CHANNEL, GOBANG_ROLE, GOBANG_USER} from './login'

export function GobangPrepare() {
  const navigate = useNavigate()
  const {playBackground} = useSound()
  const [role] = useLocalStorage<Role>(GOBANG_ROLE)
  const [userId] = useLocalStorage<string>(GOBANG_USER)
  const [channelId] = useLocalStorage<string>(GOBANG_CHANNEL)
  const {prepareMutation} = useCustomMutation()
  const anotherRole = role === Role.WHITE ? Role.BLACK : Role.WHITE
  const {totalData} = useHistoryData()
  const gameReady = useMemo(() => {
    const prepareData = totalData.filter(({data}) => data.kind === 'prepare')
    return new Set(prepareData.map(({userId}) => userId)).size
  }, [totalData])

  useEffect(() => {
    if (gameReady >= 2) {
      setTimeout(() => navigate('/gobang/stage'), 1000)
    }
  }, [gameReady, navigate])

  useEffectOnce(() => {
    if (!role || !channelId || !userId) {
      navigate('/gobang')
    } else {
      playBackground({type: 'kisstherain'})
      prepareMutation()
    }
  })

  return (
    <AppStage>
      <Background />
      <Stack width={200} m="auto" spacing={4}>
        <UserStatus align="left" role={anotherRole}>
          {gameReady >= 2 && (
            <Stack direction="row" spacing={1} alignItems="center">
              <CheckRounded sx={{color: 'lightgreen', fontSize: 36}} />
              <Typography>已准备</Typography>
            </Stack>
          )}
        </UserStatus>
        <UserStatus align="left" role={role!}>
          {gameReady >= 1 && (
            <Stack direction="row" spacing={1} alignItems="center">
              <CheckRounded sx={{color: 'lightgreen', fontSize: 36}} />
              <Typography>已准备</Typography>
            </Stack>
          )}
        </UserStatus>
      </Stack>
    </AppStage>
  )
}
