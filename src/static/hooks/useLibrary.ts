import { AxiosResponse } from 'axios';
import { useState, useRef, useEffect } from 'react'
import { Music } from '../../types/Music'

export const useLibrary = <T>({
  fetchData,
}: {
  fetchData: (page: number, limit?: number) => Promise<any>
}): {
  curPage: number;
  setCurPage: (curPage: number) => void;
  list: T[];
  loadNextPage: () => Promise<boolean>;
} => {
  const [ list, setList ] = useState<T[]>([])
  const [ curPage, setCurPage ] = useState<number>(0)
  const loadedPages = useRef<number[]>([])

  const loadNextPage = async () => {
    if (loadedPages.current.includes(curPage)) {
      return false
    }
    return fetchData(curPage).then(resp => {
      const { status, data } = resp
      if (status === 200 && data) {
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
    loadedPages.current = []
    setCurPage(0)
    loadNextPage()
  }, [fetchData])
  
  return {
    loadNextPage,
    curPage, setCurPage,
    list
  }
}