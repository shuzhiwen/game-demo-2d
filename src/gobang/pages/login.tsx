import {useEnterChannelMutation, useTransportUserCountLazyQuery} from '@generated/apollo'
import {Role} from '@gobang/render'
import {Button, Stack, TextField} from '@mui/material'
import {uuid} from 'awesome-chart'
import {useCallback, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {useLocalStorage} from 'react-use'

export const GOBANG_USER = 'GOBANG_USER'
export const GOBANG_ROLE = 'GOBANG_ROLE'
export const GOBANG_CHANNEL = 'GOBANG_CHANNEL'

export function GobangEnter() {
  const [code, setCode] = useState('')
  const [userId] = useLocalStorage(GOBANG_USER, uuid())
  const [, setChannelId] = useLocalStorage<string>(GOBANG_CHANNEL)
  const [, setRole] = useLocalStorage<Role>(GOBANG_ROLE)
  const [enterMutation] = useEnterChannelMutation()
  const [countQuery] = useTransportUserCountLazyQuery()
  const navigate = useNavigate()

  const connectServer = useCallback(async () => {
    const {data: count} = await countQuery({
      variables: {channelId: code},
    })
    if (!count?.transportUserCount) {
      setRole(Role.BLACK)
    } else if (count.transportUserCount === 1) {
      setRole(Role.WHITE)
    } else {
      alert('房间人数已满')
      return
    }
    const {data: enter} = await enterMutation({
      variables: {input: {channelId: code, userId: userId!}},
    })
    if (enter?.enterChannel) {
      setChannelId(code)
      navigate('/gobang/prepare')
    } else {
      alert('连接服务器失败')
    }
  }, [code, countQuery, enterMutation, navigate, setChannelId, setRole, userId])

  return (
    <Stack p={4} spacing={2}>
      <TextField label="房间代码" value={code} onChange={(e) => setCode(e.target.value)} />
      <Button variant="contained" onClick={connectServer}>
        进入房间
      </Button>
    </Stack>
  )
}
