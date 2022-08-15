import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { useSetRecoilState, useRecoilValue } from 'recoil'
import { libraryState, libraryScrollState } from '../model/library'
import { playingState } from '../model/playing'
import { useLoadmore } from '../hooks/useLoadmore'
import { getLibrary, scanLibrary } from '../API'
import Songlist from '../Components/Songlist'

const { Fragment } = React
const Library = (props) => {
  const setPlaying = useSetRecoilState(playingState)
  const memScrollTop = useRecoilValue(libraryScrollState)
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
      navi('/playing')
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

  return (
    <Fragment>
      <button onClick={scanLibrary}>Scan</button>
      <Songlist
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
