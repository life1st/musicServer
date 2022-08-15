import * as React from 'react'
import {
  Routes,
  Route,
  Link
} from 'react-router-dom'
import Library from './Pages/Library'
import Search from './Pages/Search'
import Albums from './Pages/Albums'
import AlbumDetail from './Pages/AlbumDetail'
import FullEditor from './Pages/FullEditor'
import PlayingList from './Pages/PlayingList'

export const ROUTES = {
  LIBRARY: '/library',
  SEARCH: '/search',
  PLAYING: '/playing',
  ALBUMS: '/albums',
  ALBUM_DETAIL: '/album/:albumId',
  FULL_EDITOR: '/music/:id/edit',
  PLAYING_LIST: '/playing_list',
}
export const Pages = () => {
  const pages = [{
      name: 'Library',
      path: ROUTES.LIBRARY,
      comp: <Library />
    }, {
      name: 'Serach',
      path: ROUTES.SEARCH,
      comp: <Search />
    }, {
      name: 'Playing',
      path: ROUTES.PLAYING,
      comp: <div />
    }, {
      name: 'Albums',
      path: ROUTES.ALBUMS,
      comp: <Albums />
    }, {
      name: 'Album Detail',
      path: ROUTES.ALBUM_DETAIL,
      comp: <AlbumDetail />
    }, {
      name: 'Full Editor',
      path: ROUTES.FULL_EDITOR,
      comp: <FullEditor />
    }, {
      name: 'Playing List',
      path: ROUTES.PLAYING_LIST,
      comp: <PlayingList />
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
