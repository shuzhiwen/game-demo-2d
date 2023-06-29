import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import {noop} from 'lodash-es'
import {PropsWithChildren, createContext, useCallback, useContext, useState} from 'react'

type NoticeState = {
  open: boolean
  title?: Maybe<string>
  content?: Maybe<string>
  onClose?: AnyFunction
}

type Context = {
  notice: (props: Omit<NoticeState, 'open'>) => void
}

const DialogContext = createContext<Context>({notice: noop})

export const useDialog = () => useContext(DialogContext)

export function DialogProvider(props: PropsWithChildren) {
  const [notice, setNotice] = useState<NoticeState>({open: false})
  const showNotice = useCallback((props: Omit<NoticeState, 'open'>) => {
    setNotice({...props, open: true})
  }, [])
  const hideNotice = useCallback(() => {
    notice.onClose?.()
    setNotice((prev) => ({...prev, open: false, onClose: undefined}))
  }, [notice])

  return (
    <DialogContext.Provider value={{notice: showNotice}}>
      {props.children}
      <Dialog open={notice.open} onClose={hideNotice}>
        {notice.title && <DialogTitle>{notice.title}</DialogTitle>}
        {notice.content && <DialogContent>{notice.content}</DialogContent>}
        <DialogActions>
          <Button onClick={hideNotice} fullWidth>
            我知道了
          </Button>
        </DialogActions>
      </Dialog>
    </DialogContext.Provider>
  )
}
