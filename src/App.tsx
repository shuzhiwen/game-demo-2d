import {SportsEsports} from '@mui/icons-material'
import {IconButton, Menu, MenuItem, Stack, Typography} from '@mui/material'
import React from 'react'
import {useLocation, useNavigate} from 'react-router-dom'

const MenuDict: Record<string, string> = {
  '/started': 'started',
  '/gobang': 'gobang',
}

export function GameMenu() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const navigate = useNavigate()
  const {pathname} = useLocation()
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleNavigate = (path: string) => {
    setAnchorEl(null)
    navigate(path)
  }

  return (
    <Stack>
      <Stack direction="row" spacing={1} alignItems="center">
        <IconButton onClick={handleClick} sx={{width: 'fit-content'}}>
          <SportsEsports />
        </IconButton>
        <Typography color="black">{MenuDict[pathname]}</Typography>
      </Stack>
      <Menu anchorEl={anchorEl} onClose={handleClick} open={open}>
        {Object.entries(MenuDict).map(([path, title]) => (
          <MenuItem key={path} onClick={() => handleNavigate(path)}>
            {title}
          </MenuItem>
        ))}
      </Menu>
    </Stack>
  )
}
