import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import {noop} from 'lodash-es'
import {PropsWithChildren, createContext, useCallback, useContext, useState} from 'react'

type Props = {
  open: boolean
  title?: Maybe<string>
  content?: Maybe<string>
  onClose?: AnyFunction
}

type ContextShape = {
  showDialog: (props: Omit<Props, 'open'>) => void
}

const Context = createContext<ContextShape>({showDialog: noop})

export const useDialog = () => useContext(Context)

export function DialogProvider(props: PropsWithChildren) {
  const [state, setState] = useState<Props>({open: false})
  const show = useCallback((props: Omit<Props, 'open'>) => {
    setState({...props, open: true})
  }, [])
  const hide = useCallback(() => {
    state.onClose?.()
    setState((prev) => ({...prev, open: false, onClose: undefined}))
  }, [state])

  return (
    <Context.Provider value={{showDialog: show}}>
      {props.children}
      <Dialog open={state.open} onClose={hide}>
        {state.title && <DialogTitle>{state.title}</DialogTitle>}
        {state.content && <DialogContent>{state.content}</DialogContent>}
        <DialogActions>
          <Button onClick={hide} fullWidth>
            我知道了
          </Button>
        </DialogActions>
      </Dialog>
    </Context.Provider>
  )
}
