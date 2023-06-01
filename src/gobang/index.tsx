import {useEnterChannelMutation, useTransportUserCountLazyQuery} from '@generated/apollo'
import {Button, Stack, TextField} from '@mui/material'
import {uuid} from 'awesome-chart'
import {useCallback, useState} from 'react'
import {useLocalStorage} from 'react-use'
import {Gobang} from './game'

export function GobangEnter() {
  const [code, setCode] = useState('')
  const [userId] = useLocalStorage('userId', uuid())
  const [channelId, setChannelId] = useLocalStorage('channelId')
  const [countQuery] = useTransportUserCountLazyQuery()
  const [enterMutation] = useEnterChannelMutation()
  const connectServer = useCallback(async () => {
    const {data: count} = await countQuery({
      variables: {channelId: code},
    })
    if (count?.transportUserCount && count.transportUserCount >= 2) {
      alert('房间人数已满')
    }
    const {data: enter} = await enterMutation({
      variables: {input: {channelId: code, userId: userId!}},
    })
    if (enter?.enterChannel) {
      setChannelId(code)
    } else {
      alert('连接服务器失败')
    }
  }, [code, countQuery, enterMutation, setChannelId, userId])

  return channelId ? (
    <Gobang />
  ) : (
    <Stack p={4} spacing={2}>
      <TextField label="房间代码" value={code} onChange={(e) => setCode(e.target.value)} />
      <Button variant="contained" onClick={connectServer}>
        进入房间
      </Button>
    </Stack>
  )
}
