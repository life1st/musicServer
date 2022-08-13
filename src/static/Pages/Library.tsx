import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { useSetRecoilState, useRecoilValue } from 'recoil'
import { libraryState, libraryScrollState } from '../model/library'
import { musicState } from '../model/music'
import { useLoadmore } from '../hooks/useLoadmore'
import { getLibrary, scanLibrary } from '../API'
import Songlist from '../Components/Songlist'

const { Fragment } = React
const Library = (props) => {
  const setMusic = useSetRecoilState(musicState)
  const memScrollTop = useRecoilValue(libraryScrollState)
  const setLibraryScroll = useSetRecoilState(libraryScrollState)

  const navi = useNavigate()

  const { list, loadNextPage, hasMore, loading } = useLoadmore({
    fetchData: getLibrary,
    listState: libraryState,
  })

  const handleItemClick = (item, i) => {
      setMusic((_) => ({
        curIndex: i,
        music: item
      }))
      navi('/playing')
  }
  const handleLoadMore = () => {
    if (hasMore && !loading) {
      loadNextPage()
    }
  }

  return (
    <Fragment>
      <button onClick={scanLibrary}>Scan</button>
      <Songlist
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
