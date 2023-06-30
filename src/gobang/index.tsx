import {Route} from 'react-router-dom'
import {GobangRouteDict, GobangEnter, GobangPrepare, GobangStage} from './pages'

export const GobangEntry = (
  <Route path={GobangRouteDict['login']}>
    <Route path={GobangRouteDict['login']} Component={GobangEnter} />
    <Route path={GobangRouteDict['prepare']} Component={GobangPrepare} />
    <Route path={GobangRouteDict['stage']} Component={GobangStage} />
  </Route>
)
