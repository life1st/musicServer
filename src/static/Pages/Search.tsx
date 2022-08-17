import * as React from 'react'
import * as style from './Search.module.less'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { playingState } from '../model/playing'
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
  const setSearchListState = useSetRecoilState(searchListState)
  const setPlaying = useSetRecoilState(playingState)

  const fetchData = useCallback((pageNum) => {
    if (searchText) {
      return searchMusic(searchText, pageNum)
    } else {
      return Promise.resolve([])
    }
  }, [searchText])
  const { list, loading, hasMore, curPage, loadNextPage } = useLoadmore({
    fetchData, listState: searchListState
  }, searchText)

  const handleItemClick = (music, i) => {
    setPlaying(_ => ({
      list,
      curIndex: i,
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
      loadNextPage((curPage || 0) + 1, { deps: [searchText] })
    }
  }
  const handleScroll = (scrollTop) => {
    setSearchState(state => ({...state, scrollTop}))
  }
  const handleDeleted = (music, s) => {
    setSearchListState(_ => ({
      ..._,
      list: _.list.filter(m => m.id !== music.id),
    }))
  }

  return (
    <div className={style.container}>
      <SearchInput onSearch={handleSearch} onClear={handleClearSearch} />
      <Songlist
        className={style.searchList}
        onItemClick={handleItemClick}
        deleteSuccess={handleDeleted}
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
