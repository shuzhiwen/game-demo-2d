import {Role} from '@gobang/render'
import {Avatar, Box, Stack} from '@mui/material'
import {PropsWithChildren} from 'react'

type UserStatus = PropsWithChildren<{align: 'left' | 'right'; role: Role}>

export const RoleDict: Record<Role, string> = {
  [Role.BLACK]: '黑',
  [Role.WHITE]: '白',
  [Role.EMPTY]: '',
}

export function UserStatus({align, role, children}: UserStatus) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent={align === 'left' ? 'start' : 'end'}
      spacing={2}
    >
      {align === 'right' && <Box>{children}</Box>}
      <Avatar
        sx={{
          width: 56,
          height: 56,
          color: role === Role.BLACK ? 'white' : 'black',
          bgcolor: role === Role.BLACK ? 'black' : 'white',
        }}
      >
        {RoleDict[role]}
      </Avatar>
      {align === 'left' && <Box>{children}</Box>}
    </Stack>
  )
}
