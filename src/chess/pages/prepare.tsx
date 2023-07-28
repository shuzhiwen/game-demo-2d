import {
  Role,
  encodeInviteUrl,
  useChessNavigate,
  useChessStorage,
  useCustomMutation,
  useHistoryData,
} from '@chess/helper'
import {AppStage, Background} from '@components'
import {useSnack} from '@context'
import {useSound} from '@context/sound'
import {CheckRounded} from '@mui/icons-material'
import {Button, Stack, Typography} from '@mui/material'
import {useCallback, useEffect, useMemo} from 'react'
import {useCopyToClipboard, useEffectOnce} from 'react-use'
import {GameBar, UserStatus} from '../components'

export function ChessPrepare() {
  const navigate = useChessNavigate()
  const {showSnack} = useSnack()
  const {setBackground} = useSound()
  const {role, channelId} = useChessStorage()
  const {prepareMutation} = useCustomMutation()
  const {totalData, seq = 0} = useHistoryData()
  const [, copyAction] = useCopyToClipboard()
  const anotherRole = role === Role.WHITE ? Role.BLACK : Role.WHITE
  const gameReady = useMemo(() => {
    const prepareData = totalData.filter(({data}) => data.kind === 'prepare')
    return new Set(prepareData.map(({userId}) => userId)).size
  }, [totalData])
  const invite = useCallback(() => {
    copyAction(encodeInviteUrl(channelId!))
    showSnack({message: '邀请链接已复制到剪切板'})
  }, [channelId, copyAction, showSnack])

  useEffectOnce(() => {
    setBackground({type: 'kisstherain'})
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
        <Button variant="contained" color="warning" onClick={invite} sx={{borderRadius: 30}}>
          邀请好友一起玩
        </Button>
      </Stack>
    </AppStage>
  )
}
