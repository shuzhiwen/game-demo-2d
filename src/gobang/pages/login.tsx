import {useDialog} from '@context'
import {useEnterChannelMutation, useTransportUserCountLazyQuery} from '@generated/apollo'
import {Role} from '@gobang/render'
import {Button, Stack, TextField} from '@mui/material'
import {uuid} from 'awesome-chart'
import {useCallback, useState} from 'react'
import {useLocalStorage} from 'react-use'
import {GOBANG_CHANNEL, GOBANG_ROLE, GOBANG_USER} from './constants'
import {useGobangNavigate} from './hooks'

export function GobangEnter() {
  const [code, setCode] = useState('')
  const [userId] = useLocalStorage(GOBANG_USER, uuid())
  const [, setChannelId] = useLocalStorage<string>(GOBANG_CHANNEL)
  const [, setRole] = useLocalStorage<Role>(GOBANG_ROLE)
  const [enterMutation] = useEnterChannelMutation()
  const [countQuery] = useTransportUserCountLazyQuery()
  const navigate = useGobangNavigate()
  const {notice} = useDialog()

  const connectServer = useCallback(async () => {
    const {data: count} = await countQuery({
      variables: {channelId: code},
    })
    if (!count?.transportUserCount) {
      setRole(Role.BLACK)
    } else if (count.transportUserCount === 1) {
      setRole(Role.WHITE)
    } else {
      notice({title: '房间人数已满'})
      return
    }
    const {data: enter} = await enterMutation({
      variables: {input: {channelId: code, userId: userId!}},
    })
    if (enter?.enterChannel) {
      setChannelId(code)
      navigate('prepare')
    } else {
      notice({content: '连接服务器失败'})
    }
  }, [code, countQuery, enterMutation, navigate, notice, setChannelId, setRole, userId])

  return (
    <Stack p={4} spacing={2}>
      <TextField label="房间代码" value={code} onChange={(e) => setCode(e.target.value)} />
      <Button variant="contained" onClick={connectServer}>
        进入房间
      </Button>
    </Stack>
  )
}
