import {useChessNavigate, useCustomMutation} from '@chess/helper'
import {ExitToAppRounded} from '@mui/icons-material'
import {AppBar, IconButton, Toolbar, Typography} from '@mui/material'
import {useCallback} from 'react'

export function GameBar() {
  const {exitMutation} = useCustomMutation()
  const navigate = useChessNavigate()
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
