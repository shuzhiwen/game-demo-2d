import TapHere from '@assets/image/tap-here.jpeg'
import {SportsEsports} from '@mui/icons-material'
import {IconButton, Menu, MenuItem, Stack, Typography} from '@mui/material'
import {isMobile} from '@utils'
import React, {useMemo} from 'react'
import {useLocation, useNavigate} from 'react-router-dom'

const MenuDict: Record<string, string> = {
  '/started': '测试',
  '/gobang': '联机五子棋',
  '/go': '联机围棋',
}

export function GameMenu() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const navigate = useNavigate()
  const {pathname} = useLocation()
  const isRootPage = pathname === '/'
  const handleNavigate = (path: string) => {
    setAnchorEl(null)
    navigate(path)
  }
  const gameName = useMemo(
    () => Object.entries(MenuDict).find(([key]) => pathname.match(key))?.[1],
    [pathname]
  )

  return isMobile() && !isRootPage ? null : (
    <Stack>
      <Stack direction="row" spacing={1} alignItems="center">
        <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
          <SportsEsports />
        </IconButton>
        <Typography color="black">{gameName}</Typography>
        {isRootPage && (
          <img
            src={TapHere}
            style={{
              position: 'absolute',
              rotate: '-30deg',
              zIndex: -1,
              left: 30,
              top: 0,
            }}
          />
        )}
      </Stack>
      <Menu anchorEl={anchorEl} onClose={() => setAnchorEl(null)} open={open}>
        {Object.entries(MenuDict).map(([path, title]) => (
          <MenuItem key={path} onClick={() => handleNavigate(path)}>
            {title}
          </MenuItem>
        ))}
      </Menu>
    </Stack>
  )
}
