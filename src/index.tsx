import React from 'react'
import ReactDOM from 'react-dom'
import {BrowserRouter as Router, Route} from 'react-router-dom'
import {AppProvider} from './components/Theme'
import {App} from './App'
import './index.css'

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Route path="/">
        <AppProvider>
          <App />
        </AppProvider>
      </Route>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
)
