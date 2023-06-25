import {AppStage} from '@components'
import {useTransportHistoryQuery} from '@generated/apollo'
import {Role} from '@gobang/render'
import {Check} from '@mui/icons-material'
import {Stack, Typography} from '@mui/material'
import {useMemo} from 'react'
import {useNavigate} from 'react-router-dom'
import {useEffectOnce, useLocalStorage} from 'react-use'
import {UserStatus} from './common'
import {getGameReady, useSendData} from './hooks'
import {GOBANG_CHANNEL, GOBANG_ROLE, GOBANG_USER} from './login'

export function GobangPrepare() {
  const navigate = useNavigate()
  const [role] = useLocalStorage<Role>(GOBANG_ROLE)
  const [userId] = useLocalStorage<string>(GOBANG_USER)
  const [channelId] = useLocalStorage<string>(GOBANG_CHANNEL)
  const {prepareMutation} = useSendData()
  const anotherRole = role === Role.WHITE ? Role.BLACK : Role.WHITE
  const {data} = useTransportHistoryQuery({
    pollInterval: 1000,
    variables: {channelId: channelId!},
    onCompleted(data) {
      if (getGameReady(data?.transportHistory ?? []) >= 2) {
        navigate('/gobang/stage')
      }
    },
  })
  const gameReady = useMemo(
    () => getGameReady(data?.transportHistory ?? []),
    [data?.transportHistory]
  )

  useEffectOnce(() => {
    if (!role || !channelId || !userId) {
      navigate('/gobang')
    } else {
      prepareMutation()
    }
  })

  return (
    <AppStage>
      <Stack width={200} m="auto" spacing={4} sx={{opacity: 0.1}}>
        <UserStatus align="left" role={anotherRole}>
          {gameReady >= 2 && (
            <Stack direction="row" spacing={2}>
              <Check sx={{color: 'green'}} />
              <Typography>已准备</Typography>
            </Stack>
          )}
        </UserStatus>
        <UserStatus align="left" role={role!}>
          {gameReady >= 1 && (
            <Stack direction="row" spacing={2}>
              <Check sx={{color: 'green'}} />
              <Typography>已准备</Typography>
            </Stack>
          )}
        </UserStatus>
      </Stack>
    </AppStage>
  )
}
