import {ApolloProvider, DialogProvider} from '@context'
import {SoundProvider} from '@context/sound'
import {GobangEntry} from '@gobang'
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
            <BrowserRouter>
              <GameMenu />
              <StartedEntry />
              <GobangEntry />
            </BrowserRouter>
          </DialogProvider>
        </SoundProvider>
      </ApolloProvider>
    </StrictMode>
  )
}
