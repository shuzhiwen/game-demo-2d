import {Role, RoleBgColorDict, RoleColorDict, RoleDict} from '@chess/helper'
import {Avatar, Box, Popover, Stack, Typography} from '@mui/material'
import {PropsWithChildren, useEffect, useRef, useState} from 'react'
import {MessageInput} from './message'

type UserStatusProps = PropsWithChildren<{
  role: Role
  align: 'left' | 'right'
  message?: {content: string}
}>

export function UserStatus(props: UserStatusProps) {
  const {align, role, children, message} = props
  const [open, setOpen] = useState(false)
  const anchorRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<number>()

  useEffect(() => {
    if (message?.content) {
      setOpen(true)
      clearTimeout(timerRef.current as number)
      timerRef.current = setTimeout(() => setOpen(false), 3000) as any
    }
  }, [message])

  return (
    <Stack
      direction="row"
      alignItems="center"
      position="relative"
      justifyContent={align === 'left' ? 'start' : 'end'}
      spacing={2}
    >
      {align === 'right' && (
        <Stack flex={1} height="100%" justifyContent="center" alignItems="start">
          <MessageInput />
        </Stack>
      )}
      {align === 'right' && <Box>{children}</Box>}
      <Avatar
        ref={anchorRef}
        sx={{
          width: 52,
          height: 52,
          color: RoleBgColorDict[role],
          bgcolor: RoleColorDict[role],
          border: 'solid 2px gray',
        }}
      >
        {RoleDict[role]}
      </Avatar>
      <Popover
        open={open}
        anchorEl={anchorRef.current}
        anchorOrigin={
          align === 'left'
            ? {horizontal: 'right', vertical: 'bottom'}
            : {horizontal: 'left', vertical: 'top'}
        }
        transformOrigin={
          align === 'left'
            ? {horizontal: 'left', vertical: 'top'}
            : {horizontal: 'right', vertical: 'bottom'}
        }
        sx={{
          pointerEvents: 'none',
          '.MuiPaper-root': {
            borderRadius: align === 'left' ? '0 24px 24px' : '24px 24px 0',
          },
        }}
      >
        <Stack sx={{p: 2, maxWidth: 'calc(100vw - 120px)'}}>
          <Typography>{message?.content}</Typography>
        </Stack>
      </Popover>
      {align === 'left' && <Box>{children}</Box>}
    </Stack>
  )
}
