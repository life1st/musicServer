import { AxiosResponse } from 'axios';
import { useState, useRef, useEffect } from 'react'
import { Music } from '../../types/Music'

export const useLibrary = ({
  fetchData,
}: {
  fetchData: (page: number, limit?: number) => Promise<AxiosResponse<Music[]>>
}): {
  curPage: number;
  setCurPage: (curPage: number) => void;
  list: Music[];
  loadNextPage: () => Promise<boolean>;
} => {
  const [list, setList] = useState<Music[]>([])
  const [ curPage, setCurPage ] = useState<number>(0)
  const loadedPages = useRef<number[]>([])

  const loadNextPage = () => {
    return fetchData(curPage).then(resp => {
      const { status, data } = resp
      if (status === 200 
          && !loadedPages.current.includes(curPage)
          && data.length > 0
      ) {
          if (curPage === 0) {
            loadedPages.current = [curPage]
            setList(data)
          } else {
            loadedPages.current.push(curPage)
            setList(list.concat(data))
          }
          return true
      }
      return false
    })
  }
  useEffect(() => {
    loadNextPage()
  }, [curPage])

  useEffect(() => {
    setCurPage(0)
    loadNextPage()
  }, [fetchData])
  
  return {
    loadNextPage,
    curPage, setCurPage,
    list
  }
}