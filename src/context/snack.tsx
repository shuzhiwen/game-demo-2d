import {Snackbar, SnackbarProps} from '@mui/material'
import {noop} from 'lodash-es'
import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useState,
} from 'react'

type Props = Pick<SnackbarProps, 'open' | 'message' | 'anchorOrigin'>

const Context = createContext<{
  showSnack: (props: Omit<Props, 'open'>) => void
}>({showSnack: noop})

export const useSnack = () => useContext(Context)

export function SnackProvider(props: PropsWithChildren) {
  const [state, setState] = useState<Props>({open: false})
  const show = useCallback((props: Omit<Props, 'open'>) => {
    setState({...props, open: true})
  }, [])
  const hide = useCallback(() => {
    setState((prev) => ({...prev, open: false}))
  }, [])

  return (
    <Context.Provider value={{showSnack: show}}>
      {props.children}
      <Snackbar
        autoHideDuration={2000}
        anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
        sx={{width: 'fit-content', margin: 'auto'}}
        {...state}
        onClose={hide}
        key="global"
      />
    </Context.Provider>
  )
}
