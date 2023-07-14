import {useDialog} from '@context'
import {useEnterChannelMutation, useTransportUsersLazyQuery} from '@generated'
import {useGobangNavigate, useGobangStorage} from '@gobang/helper'
import {decodeInviteUrl} from '@gobang/helper/invite'
import {Role} from '@gobang/render'
import {Button, Stack, TextField} from '@mui/material'
import {useCallback, useState} from 'react'
import {useEffectOnce, useSearchParam} from 'react-use'

export function GobangEnter() {
  const storage = useGobangStorage()
  const navigate = useGobangNavigate()
  const inviteCode = useSearchParam('code')
  const [code, setCode] = useState('')
  const [enterMutation] = useEnterChannelMutation()
  const [usersQuery] = useTransportUsersLazyQuery()
  const {showDialog} = useDialog()

  const connectServer = useCallback(
    async (channelId = code) => {
      const {userId, setChannelId, setRole} = storage
      const {data: usersResult} = await usersQuery({
        variables: {channelId},
      })
      const users = usersResult?.transportUsers ?? []

      if (users.includes(userId!)) {
        navigate(users.length === 1 ? 'prepare' : 'stage')
        return
      } else if (users.length >= 2) {
        showDialog({title: '房间人数已满'})
        return
      }

      const {data: enter} = await enterMutation({
        variables: {input: {channelId, userId: userId!}},
      })
      const userCount = enter?.enterChannel

      if (userCount) {
        setChannelId(channelId)
        setRole(userCount === 1 ? Role.BLACK : Role.WHITE)
        setTimeout(() => navigate('prepare'))
      } else {
        showDialog({content: '连接服务器失败'})
      }
    },
    [code, storage, usersQuery, enterMutation, navigate, showDialog]
  )

  useEffectOnce(() => {
    if (inviteCode) {
      const channelId = decodeInviteUrl(inviteCode)
      channelId && connectServer(channelId)
    }
  })

  return (
    <Stack p={4} spacing={2}>
      <TextField label="房间代码" value={code} onChange={(e) => setCode(e.target.value)} />
      <Button variant="contained" onClick={() => connectServer()}>
        进入房间
      </Button>
    </Stack>
  )
}
