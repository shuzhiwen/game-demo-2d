import {Navigate, Route, Routes} from 'react-router-dom'
import {ChessRouteDict, ChessStorageProvider} from './helper'
import {ChessEnter, ChessPrepare, GoStage, GobangStage} from './pages'
import {ChineseStage} from './pages/chinese'

export function ChessEntry() {
  return (
    <ChessStorageProvider>
      <Routes>
        <Route
          path={ChessRouteDict['go_base']}
          element={<Navigate to={ChessRouteDict['go_login']} replace />}
        />
        <Route path={ChessRouteDict['go_login']} Component={ChessEnter} />
        <Route path={ChessRouteDict['go_prepare']} Component={ChessPrepare} />
        <Route path={ChessRouteDict['go_stage']} Component={GoStage} />
        <Route
          path={ChessRouteDict['gobang_base']}
          element={<Navigate to={ChessRouteDict['gobang_login']} replace />}
        />
        <Route path={ChessRouteDict['gobang_login']} Component={ChessEnter} />
        <Route
          path={ChessRouteDict['gobang_prepare']}
          Component={ChessPrepare}
        />
        <Route path={ChessRouteDict['gobang_stage']} Component={GobangStage} />
        <Route
          path={ChessRouteDict['chinese_base']}
          element={<Navigate to={ChessRouteDict['chinese_login']} replace />}
        />
        <Route path={ChessRouteDict['chinese_login']} Component={ChessEnter} />
        <Route
          path={ChessRouteDict['chinese_prepare']}
          Component={ChessPrepare}
        />
        <Route
          path={ChessRouteDict['chinese_stage']}
          Component={ChineseStage}
        />
      </Routes>
    </ChessStorageProvider>
  )
}
