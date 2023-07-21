import {ChessEntry} from '@chess'
import {ApolloProvider, DialogProvider, SnackProvider, SoundProvider} from '@context'
import {StrictMode} from 'react'
import {BrowserRouter} from 'react-router-dom'
import {GameMenu} from './menu'
import {StartedEntry} from './started'

export function App() {
  return (
    <StrictMode>
      <ApolloProvider>
        <SoundProvider>
          <DialogProvider>
            <SnackProvider>
              <BrowserRouter>
                <GameMenu />
                <StartedEntry />
                <ChessEntry />
              </BrowserRouter>
            </SnackProvider>
          </DialogProvider>
        </SoundProvider>
      </ApolloProvider>
    </StrictMode>
  )
}
