import {useChessNavigate, useCustomMutation} from '@chess/helper'
import {useSound} from '@context'
import {
  ExitToAppRounded,
  VolumeOffRounded,
  VolumeUpRounded,
} from '@mui/icons-material'
import {AppBar, IconButton, Toolbar, Typography} from '@mui/material'
import {useCallback} from 'react'

export function GameBar() {
  const {useBackground} = useSound()
  const navigate = useChessNavigate()
  const {exitMutation} = useCustomMutation()
  const {toggle, playing} = useBackground
  const handleExit = useCallback(async () => {
    await exitMutation()
    navigate('login')
  }, [exitMutation, navigate])

  return (
    <AppBar position="relative" color="transparent">
      <Toolbar sx={{svg: {color: 'white'}}}>
        <Typography variant="h6" flex={1}></Typography>
        <IconButton onClick={toggle}>
          {playing ? <VolumeUpRounded /> : <VolumeOffRounded />}
        </IconButton>
        <IconButton onClick={handleExit}>
          <ExitToAppRounded />
        </IconButton>
      </Toolbar>
    </AppBar>
  )
}
