import {ApolloProvider, DialogProvider} from '@context'
import {SoundProvider} from '@context/sound'
import {GobangEntry} from '@gobang'
import {StrictMode} from 'react'
import {BrowserRouter, Routes} from 'react-router-dom'
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
              <Routes>
                {StartedEntry}
                {GobangEntry}
              </Routes>
            </BrowserRouter>
          </DialogProvider>
        </SoundProvider>
      </ApolloProvider>
    </StrictMode>
  )
}
