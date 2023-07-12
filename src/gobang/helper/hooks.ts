import {
  SendDataInput,
  TransportHistoryQueryVariables,
  useExitChannelMutation,
  useReceiveDataSubscription,
  useSendDataMutation,
  useTransportHistoryLazyQuery,
  useTransportHistoryQuery,
} from '@generated/apollo'
import {Role, initialChess} from '@gobang/render'
import {useCallback, useMemo} from 'react'
import {useNavigate} from 'react-router-dom'
import {useEffectOnce, useLocation} from 'react-use'
import {GobangRouteDict} from './constants'
import {useGobangStorage} from './context'

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
  const {role, userId, channelId} = useGobangStorage()
  const {data, refetch} = useTransportHistoryQuery({
    skip: !channelId,
    variables: {...pagination, channelId: channelId!},
    pollInterval: 3000,
  })
  const latest = useMemo(
    () => data?.transportHistory?.find(({data}) => data?.kind === 'chess'),
    [data?.transportHistory]
  )

  useReceiveDataSubscription({
    variables: {channelId: channelId!},
    onData: () => refetch(),
  })

  return {
    data: latest?.data,
    totalData: data?.transportHistory ?? [],
    isMe: latest ? latest?.userId === userId : role === Role.WHITE,
    seq: data?.transportHistory?.at(0)?.seq,
  }
}

export function useCustomMutation() {
  const {userId, channelId, setChannelId, setRole} = useGobangStorage()
  const [sendMutation, {loading}] = useSendDataMutation()
  const [exitMutation] = useExitChannelMutation()

  return {
    prepareMutation: async (seq: number) => {
      if (loading) return
      if (!userId || !channelId) throw new Error()
      const data = {kind: 'prepare', payload: true} as PrepareData
      return sendMutation({
        variables: {input: {userId, channelId, data, seq}},
      })
    },
    appendChessMutation: async (payload: ChessData['payload'], seq: number) => {
      if (loading) return
      if (!userId || !channelId) throw new Error()
      const data = {kind: 'chess', payload} as ChessData
      return sendMutation({
        variables: {input: {userId, channelId, data, seq, serialize: true}},
      })
    },
    exitMutation: async () => {
      if (!userId || !channelId) throw new Error()
      const result = await exitMutation({variables: {input: {channelId, userId}}})
      setChannelId()
      setRole()
      return result
    },
  }
}

export function useGobangNavigate() {
  const _navigate = useNavigate()
  const {pathname} = useLocation()
  const {role, channelId} = useGobangStorage()
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

export function useInitialDataLazyQuery() {
  const {role, userId, channelId} = useGobangStorage()
  const [query] = useTransportHistoryLazyQuery()

  return async () => {
    const {data} = await query({variables: {channelId: channelId!}})
    const anotherRole = role === Role.WHITE ? Role.BLACK : Role.WHITE
    const initialData = initialChess()

    data?.transportHistory?.forEach((datum) => {
      if (datum.data?.kind === 'chess') {
        const [x, y] = (datum.data as ChessData).payload
        const dataRole = datum.userId === userId ? role! : anotherRole
        const target = initialData.find(([_x, _y]) => x === _x && y === _y)
        if (!target) throw new Error()
        target[2] = dataRole
      }
    })

    return initialData
  }
}
