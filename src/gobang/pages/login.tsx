import {useDialog} from '@context'
import {useEnterChannelMutation, useTransportUsersLazyQuery} from '@generated/apollo'
import {useGobangNavigate, useGobangStorage} from '@gobang/helper'
import {Role} from '@gobang/render'
import {Button, Stack, TextField} from '@mui/material'
import {useCallback, useState} from 'react'

export function GobangEnter() {
  const [code, setCode] = useState('')
  const {userId, setChannelId, setRole} = useGobangStorage()
  const [enterMutation] = useEnterChannelMutation()
  const [usersQuery] = useTransportUsersLazyQuery()
  const navigate = useGobangNavigate()
  const {notice} = useDialog()

  const connectServer = useCallback(async () => {
    const {data: usersResult} = await usersQuery({
      variables: {channelId: code},
    })
    const users = usersResult?.transportUsers ?? []

    if (users.includes(userId!)) {
      navigate('stage')
      return
    } else if (users.length >= 2) {
      notice({title: '房间人数已满'})
      return
    }

    const {data: enter} = await enterMutation({
      variables: {input: {channelId: code, userId: userId!}},
    })
    const userCount = enter?.enterChannel

    if (userCount) {
      setChannelId(code)
      setRole(userCount === 1 ? Role.BLACK : Role.WHITE)
      setTimeout(() => navigate('prepare'))
    } else {
      notice({content: '连接服务器失败'})
    }
  }, [code, usersQuery, enterMutation, navigate, notice, setChannelId, setRole, userId])

  return (
    <Stack p={4} spacing={2}>
      <TextField label="房间代码" value={code} onChange={(e) => setCode(e.target.value)} />
      <Button variant="contained" onClick={connectServer}>
        进入房间
      </Button>
    </Stack>
  )
}
