import styled from '@emotion/styled'
import {Stack} from '@mui/material'

export const FullStack = styled(Stack)({
  width: '100%',
  height: '100%',
  overflow: 'auto',
})

export const AppStage = styled(Stack)({
  width: '100vw',
  height: 'calc(100vh - 40px)',
  overflow: 'auto',
  backgroundColor: 'black',
})
