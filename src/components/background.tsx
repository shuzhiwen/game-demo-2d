import bgMobile from '@assets/image/bgmobile.jpg'
import bgWeb from '@assets/image/bgweb.jpg'
import {Box} from '@mui/material'
import {isMobile} from '@utils'

export function Background() {
  return (
    <Box
      sx={{
        zIndex: -1,
        width: '100%',
        height: '100%',
        position: 'absolute',
        background: `linear-gradient(rgba(0,0,0,.5), rgba(0,0,0,.5)),url(${
          isMobile() ? bgMobile : bgWeb
        })`,
        backgroundSize: 'cover',
      }}
    />
  )
}
