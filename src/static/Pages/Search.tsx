import * as React from 'react'
import * as style from './styles/Search.module.less'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { playingState } from '../model/playing'
import { searchPageState, searchListState } from '../model/search'
import { searchMusic, scanAlbumsFromMusic } from '../API'
import { SearchInput } from '../Components/SearchInput'
import Songlist from '../Components/Songlist'
import { useLoadmore } from '../hooks/useLoadmore'
import { confirm } from '../Components/ModalBox/Confirm'
import { Svg } from '../Components/Svg'
import {
  enable as enableDarkMode,
  disable as disableDarkMode,
  isEnabled as isEnabledDarkMode,
} from 'darkreader'
import { darkModeConfig, autoDarkModeUtils } from '../utils/darkmodeHelper'
import { toast } from '../Components/ModalBox/Toast'

const { useCallback, useState, useEffect } = React
const darkEnableStatus = isEnabledDarkMode()

const Search = (props) => {
  const {
    scrollTop: memScrollTop,
    searchText,
  } = useRecoilValue(searchPageState)
  const setSearchState = useSetRecoilState(searchPageState)
  const setSearchListState = useSetRecoilState(searchListState)
  const setPlaying = useSetRecoilState(playingState)
  const [ isEnableDark, setDark ] = useState(darkEnableStatus)

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
  const handleOpenMenu = async () => {
    const isAutoDark = autoDarkModeUtils.getEnabledAuto()
    confirm({
      unmountDelay: 1,
      options: [{
        text: '设置',
        action: () => {
          console.log('toSetting')
        }
      }, {
        text: 'scan albums from music',
        action: async () => {
          console.log('scan')
          await scanAlbumsFromMusic()
          toast({ text: 'success' })
        }
      }, {
        text: isEnableDark ? 'disable DarkMode' : 'enable DarkMode',
        action: () => {
          isEnableDark ? disableDarkMode() : enableDarkMode(darkModeConfig)
          autoDarkModeUtils.setIsUsingDark(!isEnableDark)
          setDark(!isEnableDark)
        }
      }, {
        text: isAutoDark ? 'disable auto darkmode' : 'enable auto darkmode',
        action: () => {
          autoDarkModeUtils.setEnable(!isAutoDark)
        }
      }]
    })
  }

  useEffect(() => {
    setDark(isEnabledDarkMode())
  }, [])

  return (
    <div className={style.container}>
      <div className={style.inputContainer}>
        <SearchInput
          className={style.searchInput}
          onSearch={handleSearch} 
          onClear={handleClearSearch}
        />
        <Svg
          src={require('../imgs/ic-menu.svg')}
          className={style.icMenu}
          onClick={handleOpenMenu}
        />
      </div>
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
