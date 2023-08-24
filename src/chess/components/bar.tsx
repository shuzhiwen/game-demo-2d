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
  const {useSoundControl} = useSound()
  const navigate = useChessNavigate()
  const {exitMutation} = useCustomMutation()
  const {pause, play, playing} = useSoundControl
  const toggleBackground = useCallback(() => {
    playing ? pause() : play()
  }, [pause, play, playing])
  const handleExit = useCallback(async () => {
    await exitMutation()
    navigate('login')
  }, [exitMutation, navigate])

  return (
    <AppBar position="relative" color="transparent">
      <Toolbar sx={{svg: {color: 'white'}}}>
        <Typography variant="h6" flex={1}></Typography>
        <IconButton onClick={toggleBackground}>
          {playing ? <VolumeUpRounded /> : <VolumeOffRounded />}
        </IconButton>
        <IconButton onClick={handleExit}>
          <ExitToAppRounded />
        </IconButton>
      </Toolbar>
    </AppBar>
  )
}
