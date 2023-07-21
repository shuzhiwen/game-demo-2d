import {uuid} from 'awesome-chart'
import {noop} from 'lodash-es'
import {PropsWithChildren, createContext, useCallback, useContext, useEffect, useState} from 'react'
import {useLocalStorage} from 'react-use'
import {Role} from './constants'

type Storage = {
  role: Role
  userId: string
  channelId: string
}

type Context = Partial<Storage> & {
  setRole: (role?: Role) => void
  setUserId: (userId?: string) => void
  setChannelId: (channelId?: string) => void
}

const ChessContext = createContext<Context>({
  userId: uuid(),
  setRole: noop,
  setUserId: noop,
  setChannelId: noop,
})

export const useChessStorage = () => useContext(ChessContext)

export function ChessStorageProvider(props: PropsWithChildren) {
  const [storage, setStorage] = useLocalStorage<Partial<Context>>('CHESS', {
    userId: uuid(),
  })
  const [data, setData] = useState<Partial<Context>>(storage!)
  const setRole = useCallback<Context['setRole']>(
    (role) => setData((prev) => ({...prev, role})),
    [setData]
  )
  const setUserId = useCallback<Context['setUserId']>(
    (userId?: string) => setData((prev) => ({...prev, userId})),
    [setData]
  )
  const setChannelId = useCallback<Context['setChannelId']>(
    (channelId?: string) => setData((prev) => ({...prev, channelId})),
    [setData]
  )

  useEffect(() => setStorage(data), [data, setStorage])

  return (
    <ChessContext.Provider value={{...data, setRole, setUserId, setChannelId}}>
      {props.children}
    </ChessContext.Provider>
  )
}
