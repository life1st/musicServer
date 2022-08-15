import * as React from 'react'
import * as style from './Search.module.less'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { musicState } from '../model/playing'
import { searchPageState, searchListState } from '../model/search'
import { searchMusic } from '../API'
import { SearchInput } from '../Components/SearchInput'
import Songlist from '../Components/Songlist'
import { useLoadmore } from '../hooks/useLoadmore'
const { useCallback } = React

const Search = (props) => {
  const {
    scrollTop: memScrollTop,
    searchText,
  } = useRecoilValue(searchPageState)
  const setSearchState = useSetRecoilState(searchPageState)
  const setMusic = useSetRecoilState(musicState)

  const fetchData = useCallback((pageNum) => {
    if (searchText) {
      return searchMusic(searchText, pageNum)
    } else {
      return Promise.resolve([])
    }
  }, [searchText])
  const { list, loading, hasMore, loadNextPage } = useLoadmore({
    fetchData, listState: searchListState
  })

  const handleItemClick = (music, i) => {
    setMusic((_) => ({
      curIndex: i,
      music
    }))
  }
  
  const handleSearch = async (val) => {
    setSearchState(state => ({
      ...state,
      searchText: val
    }))
  }
  const handleClearSearch = () => {
    handleSearch('')
  }

  const handleLoadMore = () => {
    if (hasMore && !loading && searchText) {
      loadNextPage()
    }
  }
  const handleScroll = (scrollTop) => {
    setSearchState(state => ({...state, scrollTop}))
  }

  return (
    <div className={style.container}>
      <SearchInput onSearch={handleSearch} onClear={handleClearSearch} />
      <Songlist
        className={style.searchList}
        onItemClick={handleItemClick}
        onReachEnd={handleLoadMore}
        onScroll={handleScroll}
        list={list}
        hasMore={hasMore}
        initScrollTop={memScrollTop}
        showLoading={Boolean(hasMore && searchText)}
      />
    </div>
  )
}

export default Search
