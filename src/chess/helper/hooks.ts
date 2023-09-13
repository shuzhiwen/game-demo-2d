import {
  TransportHistoryQueryVariables,
  useExitChannelMutation,
  useReceiveDataSubscription,
  useSendDataMutation,
  useTransportHistoryQuery,
} from '@generated'
import {RawTableList} from 'awesome-chart/dist/types'
import {useCallback, useMemo, useState} from 'react'
import {NavigateOptions, useNavigate} from 'react-router-dom'
import {useEffectOnce, useLocation} from 'react-use'
import {ChessRouteDict, ChineseChess, Role} from './constants'
import {useChessStorage} from './context'

export type GobangPayload = {
  position: Vec2
  board: RawTableList
}

export type GoPayload = {
  position: Vec2
  board: RawTableList
  eaten: boolean
}

export type ChinesePayload = {
  eaten: Maybe<ChineseChess>
  prevPosition: Vec2
  nextPosition: Vec2
  board: RawTableList
}

export interface PrepareData {
  kind: 'prepare'
  payload: true
}

export interface ChessData {
  kind: 'chess'
  payload: GobangPayload | GoPayload | ChinesePayload
}

type Pagination = Pick<TransportHistoryQueryVariables, 'limit' | 'offset'>

export function useHistoryData(pagination?: Pagination) {
  const {secondRole} = useStaticRole()
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
    data: latest?.data as Maybe<AnyObject>,
    totalData: data?.transportHistory,
    isMe: latest ? latest?.userId === userId : role === secondRole,
    seq: data?.transportHistory?.at(0)?.seq,
  }
}

export function useCustomMutation() {
  const {userId, channelId, setChannelId, setRole} = useChessStorage()
  const [sendMutation, {loading}] = useSendDataMutation()
  const [exitMutation] = useExitChannelMutation()

  return {
    prepareMutation: async (seq: number) => {
      if (loading) return
      if (!userId || !channelId) throw new Error()
      const data = {kind: 'prepare', payload: true} as PrepareData
      sendMutation({
        variables: {input: {userId, channelId, data, seq}},
      })
    },
    appendChessMutation: async (payload: ChessData['payload'], seq: number) => {
      if (loading) return
      if (!userId || !channelId) throw new Error()
      const data = {kind: 'chess', payload} as ChessData
      sendMutation({
        variables: {input: {userId, channelId, data, seq, serialize: true}},
      })
    },
    sendMessageMutation: async (data: string) => {
      if (loading) return
      if (!userId || !channelId) throw new Error()
      sendMutation({
        variables: {
          input: {userId, channelId: `${channelId}_chat`, data, seq: 0},
        },
      })
    },
    exitMutation: async () => {
      if (!userId || !channelId) throw new Error()
      await exitMutation({variables: {input: {channelId, userId}}})
      setChannelId()
      setRole()
    },
  }
}

export function useChessNavigate() {
  const _navigate = useNavigate()
  const {pathname} = useLocation()
  const {role, channelId} = useChessStorage()
  const navigate = useCallback(
    (page: 'login' | 'prepare' | 'stage', options?: NavigateOptions) => {
      const key = pathname?.match('gobang')
        ? 'gobang'
        : pathname?.match('chinese')
        ? 'chinese'
        : 'go'
      _navigate(ChessRouteDict[`${key}_${page}`], options)
    },
    [_navigate, pathname]
  )

  useEffectOnce(() => {
    if (!channelId || !role) {
      navigate('login', {replace: true})
    } else if (!pathname?.match('stage')) {
      navigate('prepare', {replace: true})
    }
  })

  return navigate
}

export function useStaticRole() {
  const {pathname} = useLocation()
  const {role} = useChessStorage()
  const isChinese = pathname?.match('chinese')

  return {
    firstRole: isChinese ? Role.RED : Role.BLACK,
    secondRole: isChinese ? Role.BLACK : Role.WHITE,
    anotherRole:
      role !== Role.BLACK ? Role.BLACK : isChinese ? Role.RED : Role.WHITE,
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
