import {Route, Routes} from 'react-router-dom'
import {Started} from './main'

export function StartedEntry() {
  return (
    <Routes>
      <Route path="/started" Component={Started} />
    </Routes>
  )
}
