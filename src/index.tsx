import {StrictMode} from 'react'
import ReactDOM from 'react-dom'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import {GameMenu} from './App'
import {ApolloProvider} from './context'
import {GobangEnter} from './gobang'
import './index.css'
import {Started} from './started'
import {isMobile} from './utils/chaos'

ReactDOM.render(
  <StrictMode>
    <ApolloProvider>
      <BrowserRouter>
        {!isMobile() && <GameMenu />}
        <Routes>
          <Route path="/started" Component={Started} />
          <Route path="/gobang" Component={GobangEnter} />
        </Routes>
      </BrowserRouter>
    </ApolloProvider>
  </StrictMode>,
  document.getElementById('root')
)
