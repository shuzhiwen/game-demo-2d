import bg from '@assets/image/bg.jpg'
import {Box} from '@mui/material'

export function Background() {
  return (
    <Box
      sx={{
        zIndex: -1,
        width: '100%',
        height: '100%',
        position: 'absolute',
        background: `linear-gradient(rgba(0,0,0,.5), rgba(0,0,0,.5)),url(${bg})`,
        backgroundSize: 'cover',
      }}
    />
  )
}
