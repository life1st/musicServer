import * as React from 'react'
import * as style from './Search.module.less'
import { Music } from '../../types/Music'
import { searchMusic } from '../API'
import { SearchInput } from '../Components/SearchInput'
import Songlist from '../Components/Songlist'
import { useLibrary } from '../hooks/useLibrary'
const { useCallback, useState } = React

const Search = (props) => {
  const [ searchText, setSearchText ] = useState('')
  const [ searchList, setSearchList ] = useState<Music[]>([])
  const handleItemClick = () => {

  }
  const handleClearSearch = () => {
    setSearchText('')
  }
  const handleSearch = async (val) => {
    setSearchText(val)
  }

  const fetchData = useCallback((pageNum) => searchMusic(searchText, pageNum), [searchText])
  const { list, curPage, setCurPage } = useLibrary({fetchData})

  return (
    <div>
      <SearchInput onSearch={handleSearch} onClear={handleClearSearch} />
      <Songlist onItemClick={handleItemClick} list={list} />
    </div>
  )
}

export default Search
