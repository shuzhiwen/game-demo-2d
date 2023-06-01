import {Route} from 'react-router-dom'
import {GobangEnter} from './pages/login'
import {GobangStage} from './pages/stage'

export const Gobang = (
  <>
    <Route path="/gobang" Component={GobangEnter} />
    <Route path="/gobang/stage" Component={GobangStage} />
  </>
)
