import * as React from 'react'
import {
  Routes,
  Route,
  useNavigate,
  useMatch
} from 'react-router-dom'
import { EndFix } from './Components/Scroller'
import { ROUTES } from './consts'

const { useEffect, lazy, Suspense } = React

const Library = lazy(() => import('./Pages/Library'))
const AlbumDetail = lazy(() => import('./Pages/AlbumDetail'))
const EditorForMusic = lazy(() => import('./Pages/EditorForMusic'))
const EditorForAlbum = lazy(() => import('./Pages/EditorForAlbum'))
const EditorForArtist = lazy(() => import('./Pages/EditorForArtist'))
const PlaylistDetail = lazy(() => import('./Pages/PlaylistDetail'))
const Playlists = lazy(() => import('./Pages/Playlists'))
const Search = lazy(() => import('./Pages/Search'))
const Albums = lazy(() => import('./Pages/Albums'))
const PlayingList = lazy(() => import('./Pages/PlayingList'))
const Artists = lazy(() => import('./Pages/Artists'))

const Pages = () => {
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
      name: 'Music Editor',
      path: ROUTES.MUSIC_EDITOR,
      comp: <EditorForMusic />
    }, {
      name: 'Album Editor',
      path: ROUTES.ALBUM_EDITOR,
      comp: <EditorForAlbum />
    }, {
      name: 'Artist Editor',
      path: ROUTES.ARTIST_EDITOR,
      comp: <EditorForArtist />
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
    }, {
      name: 'Artists',
      path: ROUTES.ARTISTS,
      comp: <Artists />
    }
  ]

  const matchIndex = useMatch('/')
  const naviTo = useNavigate()
  useEffect(() => {
    if (matchIndex) {
      naviTo(ROUTES.LIBRARY, { replace: true })
    }
  }, [])

  return (
    <Suspense fallback={<EndFix hasMore={true} showLoading={true} />}>
      <Routes>
        {
          pages.map(page => (
            <Route key={page.name} path={page.path} element={page.comp} />
          ))
        }
      </Routes>
    </Suspense>
  )
}

export default Pages
