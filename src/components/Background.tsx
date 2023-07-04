import bg1 from '@assets/image/bg1.jpg'
import bg2 from '@assets/image/bg2.jpg'
import bg3 from '@assets/image/bg3.jpg'
import bg4 from '@assets/image/bg4.jpg'
import {Box} from '@mui/material'
import {sample} from 'lodash-es'

const bgs = [bg1, bg2, bg3, bg4]

const randomBg = sample(bgs)

export function Background() {
  return (
    <Box
      sx={{
        zIndex: -1,
        width: '100%',
        height: '100%',
        position: 'absolute',
        background: `linear-gradient(rgba(0,0,0,.5), rgba(0,0,0,.5)),url(${randomBg})`,
        backgroundSize: 'cover',
      }}
    />
  )
}
