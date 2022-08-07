import * as React from 'react'
import { useSetRecoilState, useRecoilValue } from 'recoil'
import { libraryState, pageState } from '../model/library'
import { musicState } from '../model/music'
import { Music } from '../../types/Music'
import { PLAY_MODE } from '../consts'
import { getLibrary  } from '../API'
import Songlist from '../Components/Songlist'
import { Pagenation } from '../Components/Pagenation'
const { useState, useEffect, useRef, useCallback } = React

const Library = (props) => {
  const list = useRecoilValue(libraryState)
  const setList = useSetRecoilState(libraryState)

  const curPage = useRecoilValue(pageState)
  const setCurPage = useSetRecoilState(pageState)

  const { curIndex } = useRecoilValue(musicState)
  const setMusic = useSetRecoilState(musicState)

  const loadedPages = useRef<number[]>([])

  const loadNextPage = (page = curPage) => {
    return getLibrary(page).then(resp => {
        const { status, data } = resp
        if (status === 200 
            && !loadedPages.current.includes(page)
            && data.length > 0
        ) {
            loadedPages.current.push(page)
            setList(list.concat(data))
            return true
        }
        return false
    })
  }
  const handleItemClick = (item, i) => {
      setMusic((_) => ({
        curIndex: i,
        music: item
      }))
  }
  const handleLoadMore = () => {
    const nextPage = curPage + 1
    setCurPage(nextPage)
    loadNextPage(nextPage)
  }

  return (
    <Songlist
        onItemClick={handleItemClick}
        onReachEnd={handleLoadMore}
        list={list} 
    />
  )
}

export default Library
