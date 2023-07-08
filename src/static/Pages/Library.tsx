import * as React from 'react'
import * as style from './styles/Library.module.less'
import { useNavigate } from 'react-router-dom'
import { useSetRecoilState, useRecoilValue } from 'recoil'
import { libraryState, libraryScrollState } from '../model/library'
import { playingState } from '../model/playing'
import { globalData } from '../model/global'
import { useLoadmore } from '../hooks/useLoadmore'
import { getLibrary, scanLibrary } from '../API'
import Songlist from '../Components/Songlist'
import { PlaylistEntry } from '../Components/PlaylistEntry'
import { ROUTES } from '../consts'

const { Fragment } = React
const Library = (props) => {
  const setPlaying = useSetRecoilState(playingState)
  const memScrollTop = useRecoilValue(libraryScrollState)
  const { isWideScreen } = useRecoilValue(globalData)
  const setLibraryScroll = useSetRecoilState(libraryScrollState)
  const setLibraryState = useSetRecoilState(libraryState)

  const navi = useNavigate()

  const { list, loadNextPage, hasMore, loading } = useLoadmore({
    fetchData: getLibrary,
    listState: libraryState,
  })

  const handleItemClick = (item, i) => {
      setPlaying(_ => ({
        list,
        curIndex: i,
      }))
      if (!isWideScreen) {
        navi(ROUTES.PLAYING)
      }
  }
  const handleLoadMore = () => {
    if (hasMore && !loading) {
      loadNextPage()
    }
  }

  const handleDeleted = (music, s) => {
    setLibraryState(state => ({
      ...state,
      list: state.list.filter(m => m.id !== music.id),
    }))
  }
  const handleGoArtistsPage = () => {
    navi(ROUTES.ARTISTS)
  }

  return (
    <Fragment>
      <button onClick={scanLibrary}>Scan</button>
      <Songlist
        startNode={(
          <Fragment>
            <li>
              <PlaylistEntry />
            </li>
            <li onClick={handleGoArtistsPage}>
              <p style={{marginLeft: 12}}>Artists {`->`}</p>
            </li>
            <li className={style.startNodeEndfix} />
          </Fragment>
        )}
        deleteSuccess={handleDeleted}
        onItemClick={handleItemClick}
        onReachEnd={handleLoadMore}
        onScroll={setLibraryScroll}
        list={list}
        hasMore={hasMore}
        initScrollTop={memScrollTop}
        showLoading={hasMore}
      />
    </Fragment>
  )
}

export default Library
