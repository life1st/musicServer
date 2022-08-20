import * as React from 'react'
import {
  Routes,
  Route,
  useNavigate,
  useMatch
} from 'react-router-dom'
import Library from './Pages/Library'
import Search from './Pages/Search'
import Albums from './Pages/Albums'
import AlbumDetail from './Pages/AlbumDetail'
import FullEditor from './Pages/FullEditor'
import PlayingList from './Pages/PlayingList'
import Playlists from './Pages/Playlists'
import PlaylistDetail from './Pages/PlaylistDetail'

const { useEffect } = React

export const ROUTES = {
  LIBRARY: '/library',
  SEARCH: '/search',
  PLAYING: '/playing',
  ALBUMS: '/albums',
  ALBUM_DETAIL: '/album/:albumId',
  FULL_EDITOR: '/music/:id/edit',
  PLAYING_LIST: '/playing_list',
  PLAYLISTS: '/playlists',
  PLAYLIST: '/playlist/:id',
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
    }, {
      name: 'Playlists',
      path: ROUTES.PLAYLISTS,
      comp: <Playlists />
    } , {
      name: 'Playlist',
      path: ROUTES.PLAYLIST,
      comp: <PlaylistDetail />
    }
  ]

  const matchIndex = useMatch('/')
  const naviTo = useNavigate()
  useEffect(() => {
    if (matchIndex) {
      naviTo(ROUTES.PLAYLISTS, { replace: true })
    }
  }, [])

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
