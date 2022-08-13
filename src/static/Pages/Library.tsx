import * as React from 'react'
import { useSetRecoilState, useRecoilValue } from 'recoil'
import { libraryState, libraryScrollState } from '../model/library'
import { musicState } from '../model/music'
import { useLoadmore } from '../hooks/useLoadmore'
import { getLibrary  } from '../API'
import Songlist from '../Components/Songlist'
import { Pagenation } from '../Components/Pagenation'

const Library = (props) => {
  const setMusic = useSetRecoilState(musicState)
  const memScrollTop = useRecoilValue(libraryScrollState)
  const setLibraryScroll = useSetRecoilState(libraryScrollState)

  const { list, loadNextPage, hasMore, loading } = useLoadmore({
    fetchData: getLibrary,
    listState: libraryState,
  })

  const handleItemClick = (item, i) => {
      setMusic((_) => ({
        curIndex: i,
        music: item
      }))
  }
  const handleLoadMore = () => {
    if (hasMore && !loading) {
      loadNextPage()
    }
  }

  return (
    <Songlist
        onItemClick={handleItemClick}
        onReachEnd={handleLoadMore}
        onScroll={setLibraryScroll}
        list={list}
        hasMore={hasMore}
        initScrollTop={memScrollTop}
    />
  )
}

export default Library
