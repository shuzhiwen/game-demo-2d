import {useChessNavigate, useCustomMutation} from '@chess/helper'
import {useConfirm, useSound} from '@context'
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
  const {showConfirm} = useConfirm()
  const {exitMutation} = useCustomMutation()
  const {toggle, playing} = useBackground
  const logout = useCallback(async () => {
    await exitMutation()
    navigate('login')
  }, [exitMutation, navigate])
  const handleExit = useCallback(() => {
    showConfirm({
      title: '确定退出房间吗',
      content: '退出后对局记录可能丢失！',
      onConfirm: logout,
    })
  }, [logout, showConfirm])

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
