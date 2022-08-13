import { useState, useRef, useEffect } from 'react'

export const useLibrary = <T>({
  fetchData,
}: {
  fetchData: (page: number, limit?: number) => Promise<any>
}): {
  curPage: number;
  list: T[];
  loading: boolean;
  loadNextPage: (n?: number) => Promise<boolean>;
} => {
  const [ loading, setLoading ] = useState(false)
  const [ list, setList ] = useState<T[]>([])
  const [ curPage, setCurPage ] = useState<number>(0)
  const loadedPages = useRef<number[]>([])

  const loadNextPage = async (page = curPage + 1) => {
    if (loading) {
      return true
    }
    if (loadedPages.current.includes(page)) {
      return false
    }
    setLoading(true)
    const resp = await fetchData(page)
    const { status, data } = resp
    if (!status && page === 0 && !data?.length) {
      setList([])
    }
    if (status === 200 && data) {
        if (page === 0) {
          loadedPages.current = [page]
          setList(data)
        } else {
          loadedPages.current.push(page)
          setList(list.concat(data))
        }
        setCurPage(page)
    }
    setLoading(false)
    return data?.length
  }

  useEffect(() => {
    loadedPages.current = []
    loadNextPage(0)
  }, [fetchData])
  
  return {
    loadNextPage,
    curPage,
    list,
    loading,
  }
}