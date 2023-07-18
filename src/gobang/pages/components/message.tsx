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
        <Message fontSize="large" sx={{color: 'white'}} />
      </IconButton>
      <Popover
        open={open}
        anchorReference="none"
        onClose={() => setOpen(false)}
        sx={{'.MuiPaper-root': {left: 24, right: 24, bottom: 24}}}
      >
        <Stack direction="row" alignItems="center">
          <TextField
            fullWidth
            value={message}
            variant="outlined"
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
