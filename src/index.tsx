import {DialogProvider} from '@context/dialog'
import {StrictMode} from 'react'
import ReactDOM from 'react-dom'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import {GameMenu} from './App'
import {ApolloProvider} from './context'
import {Gobang} from './gobang'
import './index.css'
import {Started} from './started'
import {isMobile} from './utils/chaos'

ReactDOM.render(
  <StrictMode>
    <ApolloProvider>
      <DialogProvider>
        <BrowserRouter>
          {!isMobile() && <GameMenu />}
          <Routes>
            <Route path="/started" Component={Started} />
            <Route path="/gobang">{Gobang}</Route>
          </Routes>
        </BrowserRouter>
      </DialogProvider>
    </ApolloProvider>
  </StrictMode>,
  document.getElementById('root')
)
