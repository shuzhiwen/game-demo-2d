import {
  encodeInviteUrl,
  useChessNavigate,
  useChessStorage,
  useCustomMutation,
  useHistoryData,
  useStaticRole,
} from '@chess/helper'
import {AppStage, Background} from '@components'
import {useSnack} from '@context'
import {useSound} from '@context/sound'
import {CheckRounded} from '@mui/icons-material'
import {Button, Stack, Typography} from '@mui/material'
import {useCallback, useEffect, useMemo} from 'react'
import {useCopyToClipboard, useEffectOnce, useUpdateEffect} from 'react-use'
import {GameBar, UserStatus} from '../components'

export function ChessPrepare() {
  const navigate = useChessNavigate()
  const {showSnack} = useSnack()
  const {setBackground} = useSound()
  const {totalData} = useHistoryData()
  const {prepareMutation} = useCustomMutation()
  const {role, channelId, userId} = useChessStorage()
  const [, copyAction] = useCopyToClipboard()
  const {anotherRole} = useStaticRole()
  const gameReady = useMemo(() => {
    const prepareData = totalData?.filter(({data}) => data.kind === 'prepare')
    return new Set(prepareData?.map(({userId}) => userId))
  }, [totalData])
  const generateInvitationLink = useCallback(() => {
    copyAction(encodeInviteUrl(channelId!))
    showSnack({message: '邀请链接已复制到剪切板'})
  }, [channelId, copyAction, showSnack])

  useEffectOnce(() => {
    setBackground({type: 'kisstherain'})
  })

  useEffect(() => {
    if (gameReady.size >= 2) {
      setTimeout(() => navigate('stage'), 1000)
    }
  }, [gameReady, navigate])

  useUpdateEffect(() => {
    if (!gameReady.has(userId!)) {
      prepareMutation(0)
    }
  }, [gameReady, userId])

  return (
    <AppStage>
      <Background />
      <GameBar />
      <Stack minWidth={240} m="auto" spacing={4}>
        <UserStatus align="left" role={anotherRole}>
          {gameReady.size >= 2 && (
            <Stack direction="row" spacing={1} alignItems="center">
              <CheckRounded sx={{color: 'lightgreen', fontSize: 36}} />
              <Typography>已就绪</Typography>
            </Stack>
          )}
        </UserStatus>
        <UserStatus align="left" role={role!}>
          {gameReady.has(userId!) && (
            <Stack direction="row" spacing={1} alignItems="center">
              <CheckRounded sx={{color: 'lightgreen', fontSize: 36}} />
              <Typography>已就绪</Typography>
            </Stack>
          )}
        </UserStatus>
        <Button
          color="warning"
          variant="contained"
          onClick={generateInvitationLink}
          sx={{borderRadius: 30}}
        >
          邀请好友一起玩
        </Button>
      </Stack>
    </AppStage>
  )
}
