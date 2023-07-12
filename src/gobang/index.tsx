import {Route, Routes} from 'react-router-dom'
import {GobangRouteDict, GobangStorageProvider} from './helper'
import {GobangEnter, GobangPrepare, GobangStage} from './pages'

export function GobangEntry() {
  return (
    <GobangStorageProvider>
      <Routes>
        <Route path={GobangRouteDict['login']}>
          <Route path={GobangRouteDict['login']} Component={GobangEnter} />
          <Route path={GobangRouteDict['prepare']} Component={GobangPrepare} />
          <Route path={GobangRouteDict['stage']} Component={GobangStage} />
        </Route>
      </Routes>
    </GobangStorageProvider>
  )
}
