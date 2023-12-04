import {Stack, Typography} from '@mui/material'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import {isMobile} from '@utils'
import {noop} from 'lodash-es'
import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useState,
} from 'react'

type Props = {
  open: boolean
  title?: Maybe<string>
  content?: Maybe<string>
  onConfirm?: AnyFunction
  onCancel?: AnyFunction
}

const Context = createContext<{
  showConfirm: (props: Omit<Props, 'open'>) => void
}>({showConfirm: noop})

export const useConfirm = () => useContext(Context)

export function DialogProvider(props: PropsWithChildren) {
  const [state, setState] = useState<Props>({open: false})
  const {open, title, content, onCancel, onConfirm} = state
  const show = useCallback((props: Omit<Props, 'open'>) => {
    setState({...props, open: true})
  }, [])
  const createHide = useCallback(
    (callback?: AnyFunction) => () => {
      setState((prev) => ({...prev, open: false}))
      setTimeout((prev) => ({...prev, onConfirm: undefined}), 1000)
      callback?.()
    },
    []
  )

  return (
    <Context.Provider value={{showConfirm: show}}>
      {props.children}
      <Dialog open={open} onClose={createHide()}>
        {title && <DialogTitle>{title}</DialogTitle>}
        {content && (
          <DialogContent>
            <Typography variant="body2">{content}</Typography>
          </DialogContent>
        )}
        <DialogActions>
          {!onCancel && !onConfirm ? (
            <Stack flex={1}>
              <Button onClick={createHide()}>我知道了</Button>
            </Stack>
          ) : (
            <Stack flex={1} direction={isMobile() ? 'column' : 'row'}>
              <Button onClick={createHide(onCancel)} fullWidth>
                取消
              </Button>
              <Button onClick={createHide(onConfirm)} fullWidth>
                确认
              </Button>
            </Stack>
          )}
        </DialogActions>
      </Dialog>
    </Context.Provider>
  )
}
