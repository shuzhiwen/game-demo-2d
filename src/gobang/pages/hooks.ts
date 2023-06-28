import {
  SendDataInput,
  TransportHistoryQueryVariables,
  useExitChannelMutation,
  useReceiveDataSubscription,
  useSendDataMutation,
  useTransportHistoryQuery,
} from '@generated/apollo'
import {Role} from '@gobang/render'
import {useLocalStorage} from 'react-use'
import {GOBANG_CHANNEL, GOBANG_ROLE, GOBANG_USER} from './login'

export interface PrepareData {
  kind: 'prepare'
  payload: true
}

export interface ChessData {
  kind: 'chess'
  payload: [number, number]
}

export interface GobangTransportData extends SendDataInput {
  data: PrepareData | ChessData
}

type Pagination = Pick<TransportHistoryQueryVariables, 'limit' | 'offset'>

export function useHistoryData(pagination?: Pagination) {
  const [role] = useLocalStorage<Role>(GOBANG_ROLE)
  const [userId] = useLocalStorage<string>(GOBANG_USER)
  const [channelId] = useLocalStorage<string>(GOBANG_CHANNEL)
  const {data, refetch} = useTransportHistoryQuery({
    skip: !channelId,
    variables: {...pagination, channelId: channelId!},
    pollInterval: 5000,
  })
  const latest = data?.transportHistory?.at(-1) as Maybe<GobangTransportData>
  const isMe = latest ? latest?.userId === userId : role === Role.WHITE

  useReceiveDataSubscription({
    variables: {channelId: channelId!},
    onData: () => refetch(),
  })

  return {...latest, isMe, totalData: data?.transportHistory ?? []}
}

export function useCustomMutation() {
  const [userId] = useLocalStorage<string>(GOBANG_USER)
  const [channelId, setChannelId] = useLocalStorage<string>(GOBANG_CHANNEL)
  const [, setRole] = useLocalStorage<Role>(GOBANG_ROLE)
  const [sendMutation] = useSendDataMutation()
  const [exitMutation] = useExitChannelMutation()
  const {seq = 0} = useHistoryData({limit: 1})

  return {
    prepareMutation: async () => {
      if (!userId || !channelId) throw new Error()
      const data = {kind: 'prepare', payload: true} as PrepareData
      return sendMutation({
        variables: {input: {userId, channelId, data, seq: seq + 1}},
      })
    },
    appendChessMutation: async (payload: ChessData['payload']) => {
      if (!userId || !channelId) throw new Error()
      const data = {kind: 'chess', payload} as ChessData
      return sendMutation({
        variables: {input: {userId, channelId, data, seq: seq + 1, serialize: true}},
      })
    },
    exitMutation: async () => {
      if (!userId || !channelId) throw new Error()
      const result = exitMutation({variables: {input: {channelId, userId}}})
      setChannelId(undefined)
      setRole(undefined)
      return result
    },
  }
}
