import {useCustomMutation} from '@gobang/helper'
import {Message, Send} from '@mui/icons-material'
import {IconButton, Popover, Stack, TextField} from '@mui/material'
import {useCallback, useRef, useState} from 'react'

export function MessageInput() {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const triggerRef = useRef<HTMLDivElement>(null)
  const {sendMessageMutation} = useCustomMutation()
  const onSend = useCallback(async () => {
    await sendMessageMutation(message)
    setMessage('')
    setOpen(false)
  }, [message, sendMessageMutation])

  return (
    <Stack ref={triggerRef} flex={1} justifyContent="center">
      <IconButton onClick={() => setOpen(true)}>
        <Message sx={{color: 'lightgray'}} />
      </IconButton>
      <Popover
        open={open}
        anchorEl={triggerRef.current}
        onClose={() => setOpen(false)}
        sx={{'.MuiPaper-root': {right: 24}}}
      >
        <Stack direction="row" alignItems="center">
          <TextField
            variant="outlined"
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            sx={{fieldset: {border: 'none'}}}
          />
          <IconButton onClick={onSend}>
            <Send color="info" />
          </IconButton>
        </Stack>
      </Popover>
    </Stack>
  )
}
