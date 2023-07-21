import {Navigate, Route, Routes} from 'react-router-dom'
import {ChessRouteDict, ChessStorageProvider} from './helper'
import {ChessEnter, ChessPrepare, GobangStage} from './pages'

export function ChessEntry() {
  return (
    <ChessStorageProvider>
      <Routes>
        <Route
          path={ChessRouteDict['go_base']}
          element={<Navigate to={ChessRouteDict['go_login']} />}
        />
        <Route path={ChessRouteDict['go_login']} Component={ChessEnter} />
        <Route path={ChessRouteDict['go_prepare']} Component={ChessPrepare} />
        <Route path={ChessRouteDict['go_stage']} Component={GobangStage} />
        <Route
          path={ChessRouteDict['gobang_base']}
          element={<Navigate to={ChessRouteDict['gobang_login']} />}
        />
        <Route path={ChessRouteDict['gobang_login']} Component={ChessEnter} />
        <Route path={ChessRouteDict['gobang_prepare']} Component={ChessPrepare} />
        <Route path={ChessRouteDict['gobang_stage']} Component={GobangStage} />
        <Route path="*" element={<div> Not Found or You do not have permission.</div>} />
      </Routes>
    </ChessStorageProvider>
  )
}
