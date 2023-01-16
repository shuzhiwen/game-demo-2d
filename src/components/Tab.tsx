import {Box, styled, Tab, TabProps, Tabs, TabsProps, Typography} from '@mui/material'

export const MTabs = styled((props: TabsProps) => (
  <Tabs
    textColor="inherit"
    indicatorColor="secondary"
    TabIndicatorProps={{hidden: true}}
    disableRipple
    {...props}
  />
))()

export const MTab = styled((props: TabProps) => <Tab disableRipple {...props} />)(({theme}) => ({
  color: theme.palette.primary.main,
  '&.Mui-selected': {
    color: 'yellow',
    background: 'radial-gradient(#ffff00ff, #ffff002f, transparent)',
    backgroundPosition: '0 100%',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '100% 10%',
  },
}))

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

export function TabPanel(props: TabPanelProps) {
  const {children, value, index, ...other} = props

  return (
    <Box role="tabpanel" hidden={value !== index} {...other}>
      {value === index && (
        <Box sx={{p: 3}}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </Box>
  )
}
