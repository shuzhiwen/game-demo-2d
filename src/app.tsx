import {ApolloProvider, DialogProvider} from '@context'
import {SoundProvider} from '@context/sound'
import {Gobang} from '@gobang'
import {SportsEsports} from '@mui/icons-material'
import {IconButton, Menu, MenuItem, Stack, Typography} from '@mui/material'
import {isMobile} from '@utils/chaos'
import React, {StrictMode} from 'react'
import {BrowserRouter, Route, Routes, useLocation, useNavigate} from 'react-router-dom'
import {Started} from './started'

const MenuDict: Record<string, string> = {
  '/started': 'started',
  '/gobang': 'gobang',
}

export function App() {
  return (
    <StrictMode>
      <ApolloProvider>
        <SoundProvider>
          <DialogProvider>
            <BrowserRouter>
              <GameMenu />
              <Routes>
                <Route path="/started" Component={Started} />
                <Route path="/gobang">{Gobang}</Route>
              </Routes>
            </BrowserRouter>
          </DialogProvider>
        </SoundProvider>
      </ApolloProvider>
    </StrictMode>
  )
}

export function GameMenu() {
  const mobile = isMobile()
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

  return mobile ? null : (
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
