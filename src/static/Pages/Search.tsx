import * as React from 'react'
import * as style from './Search.module.less'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { musicState } from '../model/music'
import { Music } from '../../types/Music'
import { searchMusic } from '../API'
import { SearchInput } from '../Components/SearchInput'
import Songlist from '../Components/Songlist'
import { useLibrary } from '../hooks/useLibrary'
const { useCallback, useState } = React

const Search = (props) => {
  const [ hasMore, setHasMore ] = useState(true)
  const [ searchText, setSearchText ] = useState('')
  
  const setMusic = useSetRecoilState(musicState)

  const fetchData = useCallback((pageNum) => {
    if (searchText) {
      return searchMusic(searchText, pageNum)
    } else {
      return Promise.resolve([])
    }
  }, [searchText])
  const { list, curPage, setCurPage, reset } = useLibrary({fetchData})

  const handleItemClick = (music, i) => {
    setMusic((_) => ({
      curIndex: i,
      music
    }))
  }
  
  const handleClearSearch = () => {
    setSearchText('')
  }
  const handleSearch = async (val) => {
    if (!val) {
      reset()
    }
    setSearchText(val)
  }

  const handleLoadMore = (page = curPage) => {
    if (!hasMore) {
      return false;
    }
    setCurPage(page + 1)
  }

  return (
    <div>
      <SearchInput onSearch={handleSearch} onClear={handleClearSearch} />
      <Songlist
        onItemClick={handleItemClick}
        onReachEnd={handleLoadMore}
        list={list}
        hasMore={hasMore}
        showLoading={searchText.length > 0}
      />
    </div>
  )
}

export default Search
