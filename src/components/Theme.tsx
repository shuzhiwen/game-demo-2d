import {createTheme, ThemeProvider} from '@mui/material'
import {PropsWithChildren} from 'react'

const theme = createTheme({
  palette: {
    primary: {
      main: '#f2f2f2',
    },
    secondary: {
      main: '#ffff00',
    },
    text: {
      primary: '#f2f2f2',
      secondary: '#ffff00',
    },
  },
})

export function AppProvider(props: PropsWithChildren) {
  return <ThemeProvider theme={theme}>{props.children}</ThemeProvider>
}
