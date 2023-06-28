import styled from '@emotion/styled'
import {Stack} from '@mui/material'
import {isMobile} from '../utils/chaos'

export const FullStack = styled(Stack)({
  width: '100%',
  height: '100%',
  overflow: 'auto',
})

export const AppStage = styled(Stack)({
  width: '100vw',
  overflow: 'auto',
  height: isMobile() ? '100vh' : 'calc(100vh - 40px)',
  opacity: (import.meta as any).env.DEV ? 0.1 : 1,
})
