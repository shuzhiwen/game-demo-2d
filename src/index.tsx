import React from 'react'
import ReactDOM from 'react-dom'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import {GameMenu} from './App'
import {Gobang} from './gobang'
import './index.css'
import {Started} from './started'
import {isMobile} from './utils/chaos'

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      {!isMobile() && <GameMenu />}
      <Routes>
        <Route path="/started" Component={Started} />
        <Route path="/gobang" Component={Gobang} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
)
