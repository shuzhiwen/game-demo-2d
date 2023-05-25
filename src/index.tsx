import React from 'react'
import ReactDOM from 'react-dom'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import {GameMenu} from './App'
import {SectionOnePage} from './gobang'
import {Started} from './started'
import './index.css'

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <GameMenu />
      <Routes>
        <Route path="/started" Component={Started} />
        <Route path="/gobang" Component={SectionOnePage} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
)
