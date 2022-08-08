import * as React from 'react'
import {
  Routes,
  Route,
  Link
} from 'react-router-dom'
const { useEffect } = React
import Library from './Pages/Library'
import Search from './Pages/Search'

export const Pages = () => {
  const pages = [{
      name: 'Library',
      path: '/library',
      comp: <Library />
    }, {
      name: 'Serach',
      path: '/search',
      comp: <Search />
    }, {
      name: 'Playing',
      path: '/playing',
      comp: <div>Playing</div>
    }
  ]  

  return (
    <Routes>
      {
        pages.map(page => (
          <Route key={page.path} path={page.path} element={page.comp} />
        ))
      }
    </Routes>
  )
}
