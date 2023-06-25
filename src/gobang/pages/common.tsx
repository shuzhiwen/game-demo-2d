import {Role} from '@gobang/render'
import {Avatar, Box, Stack} from '@mui/material'
import {PropsWithChildren} from 'react'

type UserStatus = PropsWithChildren<{align: 'left' | 'right'; role: Role}>

export function UserStatus({align, role, children}: UserStatus) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent={align === 'left' ? 'start' : 'end'}
      spacing={4}
    >
      {align === 'right' && <Box>{children}</Box>}
      <Avatar
        sx={{
          width: 64,
          height: 64,
          color: role === Role.BLACK ? 'white' : 'black',
          bgcolor: role === Role.BLACK ? 'black' : 'white',
        }}
      >
        {role === Role.BLACK ? '黑' : '白'}
      </Avatar>
      {align === 'left' && <Box>{children}</Box>}
    </Stack>
  )
}
