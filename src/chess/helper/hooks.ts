import {initialChess} from '@chess/render'
import {
  TransportHistoryQueryVariables,
  useExitChannelMutation,
  useReceiveDataSubscription,
  useSendDataMutation,
  useTransportHistoryLazyQuery,
  useTransportHistoryQuery,
} from '@generated'
import {RawTableList} from 'awesome-chart/dist/types'
import {useCallback, useMemo, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {useEffectOnce, useLocation} from 'react-use'
import {ChessRouteDict, Role} from './constants'
import {useChessStorage} from './context'

export type GoPayload = {
  position: Vec2
  board: RawTableList
  eaten?: boolean
}

export interface PrepareData {
  kind: 'prepare'
  payload: true
}

export interface ChessData {
  kind: 'chess'
  payload: Vec2 | GoPayload
}

type Pagination = Pick<TransportHistoryQueryVariables, 'limit' | 'offset'>

export function useHistoryData(pagination?: Pagination) {
  const {role, userId, channelId} = useChessStorage()
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
  const {userId, channelId, setChannelId, setRole} = useChessStorage()
  const [sendMutation, {loading}] = useSendDataMutation()
  const [exitMutation] = useExitChannelMutation()

  return {
    loading,
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
    sendMessageMutation: async (data: string) => {
      if (loading) return
      if (!userId || !channelId) throw new Error()
      return sendMutation({
        variables: {input: {userId, channelId: `${channelId}_chat`, data, seq: 0}},
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

export function useChessNavigate() {
  const _navigate = useNavigate()
  const {pathname} = useLocation()
  const {role, channelId} = useChessStorage()
  const navigate = useCallback(
    (page: 'login' | 'prepare' | 'stage') => {
      const key = pathname?.match('gobang') ? 'gobang' : 'go'
      _navigate(ChessRouteDict[`${key}_${page}`])
    },
    [_navigate, pathname]
  )

  useEffectOnce(() => {
    if (!channelId || !role) {
      navigate('login')
    } else if (!pathname?.match('stage')) {
      navigate('prepare')
    }
  })

  return navigate
}

export function useGobangInitialDataLazyQuery() {
  const {role, userId, channelId} = useChessStorage()
  const [query] = useTransportHistoryLazyQuery()

  return async () => {
    const {data} = await query({variables: {channelId: channelId!}})
    const anotherRole = role === Role.WHITE ? Role.BLACK : Role.WHITE
    const initialData = initialChess()

    data?.transportHistory?.forEach((datum) => {
      if (datum.data?.kind === 'chess') {
        const [x, y] = (datum.data as ChessData).payload as Vec2
        const dataRole = datum.userId === userId ? role! : anotherRole
        const target = initialData.find(([_x, _y]) => x === _x && y === _y)
        if (!target) throw new Error()
        target[2] = dataRole
      }
    })

    return initialData
  }
}

export function useChatMessage() {
  const {userId, channelId} = useChessStorage()
  const [myMessage, setMyMessage] = useState({content: ''})
  const [otherMessage, setOtherMessage] = useState({content: ''})
  const setMessage = useCallback((props: {isMe: boolean; content: string}) => {
    const {isMe, content} = props
    isMe ? setMyMessage({content}) : setOtherMessage({content})
  }, [])

  useReceiveDataSubscription({
    variables: {channelId: `${channelId}_chat`},
    onData({data}) {
      if (data.data?.receiveData.userId === userId) {
        setMyMessage({content: data.data?.receiveData.data ?? ''})
      } else {
        setOtherMessage({content: data.data?.receiveData.data ?? ''})
      }
    },
  })

  return {myMessage, otherMessage, setMessage}
}
