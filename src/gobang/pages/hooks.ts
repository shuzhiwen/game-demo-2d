import {SendDataInput, useSendDataMutation, useTransportSubscription} from '@generated/apollo'
import {useLocalStorage} from 'react-use'
import {GOBANG_CHANNEL, GOBANG_USER} from './login'

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

export function useSendData() {
  const [userId] = useLocalStorage<string>(GOBANG_USER)
  const [channelId] = useLocalStorage<string>(GOBANG_CHANNEL)
  const [sendMutation] = useSendDataMutation()

  return {
    prepareMutation: async () => {
      if (!userId || !channelId) throw new Error()
      const data = {kind: 'prepare', payload: true} as PrepareData
      return sendMutation({variables: {input: {userId, channelId, data}}})
    },
    appendChessMutation: async (payload: ChessData['payload']) => {
      if (!userId || !channelId) throw new Error()
      const data = {kind: 'chess', payload} as ChessData
      return sendMutation({variables: {input: {userId, channelId, data}}})
    },
  }
}

export function useReceivedData() {
  const [channelId] = useLocalStorage<string>(GOBANG_CHANNEL)
  const {data} = useTransportSubscription({
    skip: !channelId,
    variables: {channelId: channelId!},
  })

  return data as GobangTransportData | undefined
}

export function getGameReady(data: Pick<GobangTransportData, 'data' | 'userId'>[]) {
  const prepareData = data.filter(({data}) => data.kind === 'prepare')

  return new Set(prepareData.map(({userId}) => userId)).size
}
