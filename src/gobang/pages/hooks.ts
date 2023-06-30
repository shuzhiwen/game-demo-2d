import {
  SendDataInput,
  TransportHistoryQueryVariables,
  useExitChannelMutation,
  useReceiveDataSubscription,
  useSendDataMutation,
  useTransportHistoryQuery,
} from '@generated/apollo'
import {Role} from '@gobang/render'
import {useCallback} from 'react'
import {useNavigate} from 'react-router-dom'
import {useEffectOnce, useLocalStorage, useLocation} from 'react-use'
import {GOBANG_CHANNEL, GOBANG_ROLE, GOBANG_USER, GobangRouteDict} from './constants'

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
    pollInterval: 3000,
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
  const [channelId, setChannelId] = useLocalStorage<string | null>(GOBANG_CHANNEL)
  const [, setRole] = useLocalStorage<Role | null>(GOBANG_ROLE)
  const [sendMutation] = useSendDataMutation()
  const [exitMutation] = useExitChannelMutation()

  return {
    prepareMutation: async (seq: number) => {
      if (!userId || !channelId) throw new Error()
      const data = {kind: 'prepare', payload: true} as PrepareData
      return sendMutation({
        variables: {input: {userId, channelId, data, seq}},
      })
    },
    appendChessMutation: async (payload: ChessData['payload'], seq: number) => {
      if (!userId || !channelId) throw new Error()
      const data = {kind: 'chess', payload} as ChessData
      return sendMutation({
        variables: {input: {userId, channelId, data, seq, serialize: true}},
      })
    },
    exitMutation: async () => {
      if (!userId || !channelId) throw new Error()
      const result = await exitMutation({variables: {input: {channelId, userId}}})
      setChannelId(null)
      setRole(null)
      return result
    },
  }
}

export function useGobangNavigate() {
  const _navigate = useNavigate()
  const {pathname} = useLocation()
  const [channelId] = useLocalStorage<string>(GOBANG_CHANNEL)
  const [role] = useLocalStorage<Role>(GOBANG_ROLE)
  const navigate = useCallback(
    (page: Keys<typeof GobangRouteDict>) => _navigate(GobangRouteDict[page]),
    [_navigate]
  )

  useEffectOnce(() => {
    if (!channelId || !role) {
      navigate('login')
    } else if (!pathname?.match(GobangRouteDict['stage'])) {
      navigate('prepare')
    }
  })

  return navigate
}
