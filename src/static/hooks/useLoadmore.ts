import { useState, useRef, useEffect } from "react";
import { RecoilState, RecoilValue, useRecoilValue, useSetRecoilState } from 'recoil'

export const useLoadmore = <T>({
  fetchData,
  listState,
}: {
  fetchData: (page: number, limit?: number) => Promise<any>;
  listState: RecoilState<{
    list: T[];
    curPage: number | null;
    loadedPages: number[];
    hasMore: boolean;
  }>;
}) => {
  const { list, curPage, loadedPages, hasMore } = useRecoilValue(listState)
  const setListState = useSetRecoilState(listState)
  const [ loading, setLoading ] = useState(false)
  const loadNextPage = async (page = typeof curPage === 'number' ? curPage + 1 : 0) => {
    console.log('loadNextPage', page, loadedPages)
    if (loading) {
      return true
    }
    if (loadedPages.includes(page)) {
      return false
    }
    setLoading(true)
    const resp = await fetchData(page)
    const { status, data } = resp
    if (status === 200 && data) {
      let _loadedPages = [0]
      let _list = data
      if (page > 0) {
        _loadedPages.push(page)
        _list = list.concat(data)
      }
      setListState(_state => ({
        list: _list,
        loadedPages: _loadedPages,
        curPage: page,
        hasMore: Boolean(data?.length)
      }))
    }
    setLoading(false)
    return data?.length
  }
  useEffect(() => {
    loadNextPage(0)
  } , [fetchData])
  return {
    loadNextPage,
    curPage,
    list,
    hasMore,
    loading,
  }
}