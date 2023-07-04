import {Role} from '@gobang/render'
import {ExitToAppRounded} from '@mui/icons-material'
import {AppBar, Avatar, Box, IconButton, Stack, Toolbar, Typography} from '@mui/material'
import {PropsWithChildren, useCallback} from 'react'
import {useCustomMutation, useGobangNavigate} from './hooks'

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

export function GameBar() {
  const {exitMutation} = useCustomMutation()
  const navigate = useGobangNavigate()
  const handleExit = useCallback(async () => {
    await exitMutation()
    navigate('login')
  }, [exitMutation, navigate])

  return (
    <AppBar position="relative" color="transparent">
      <Toolbar>
        <Typography variant="h6" flex={1}></Typography>
        <IconButton onClick={handleExit}>
          <ExitToAppRounded sx={{color: 'white'}} />
        </IconButton>
      </Toolbar>
    </AppBar>
  )
}
