import {Role} from '@gobang/render'
import {uuid} from 'awesome-chart'
import {noop} from 'lodash-es'
import {PropsWithChildren, createContext, useCallback, useContext, useEffect, useState} from 'react'
import {useLocalStorage} from 'react-use'

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

const GobangContext = createContext<Context>({
  userId: uuid(),
  setRole: noop,
  setUserId: noop,
  setChannelId: noop,
})

export const useGobangStorage = () => useContext(GobangContext)

export function GobangStorageProvider(props: PropsWithChildren) {
  const [storage, setStorage] = useLocalStorage<Partial<Context>>('GOBANG', {
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
    <GobangContext.Provider value={{...data, setRole, setUserId, setChannelId}}>
      {props.children}
    </GobangContext.Provider>
  )
}
