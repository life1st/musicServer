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
  const { list, curPage, loading, loadNextPage } = useLibrary<Music>({fetchData})

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
    setSearchText(val)
  }

  const handleLoadMore = async () => {
    if (!hasMore && loading) {
      return false;
    }
    const hasData = await loadNextPage(curPage + 1)
    setHasMore(hasData)
  }

  return (
    <div>
      <SearchInput onSearch={handleSearch} onClear={handleClearSearch} />
      <Songlist
        onItemClick={handleItemClick}
        onReachEnd={handleLoadMore}
        list={list}
        hasMore={hasMore}
        showLoading={loading}
      />
    </div>
  )
}

export default Search
