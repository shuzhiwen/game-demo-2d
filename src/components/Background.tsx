import bg1 from '@assets/image/bg1.jpg'
import bg2 from '@assets/image/bg2.jpg'
import bg3 from '@assets/image/bg3.jpg'
import {Box} from '@mui/material'

const bgs = [bg1, bg2, bg3]

const randomBg = bgs[Math.floor(Math.random() * 3)]

export function Background() {
  return (
    <Box
      sx={{
        zIndex: -1,
        width: '100%',
        height: '100%',
        position: 'absolute',
        background: `linear-gradient(rgba(0,0,0,.4), rgba(0,0,0,.4)),url(${randomBg})`,
        objectFit: 'cover',
      }}
    />
  )
}
