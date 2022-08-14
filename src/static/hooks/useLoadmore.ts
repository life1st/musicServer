import { useState, useRef, useEffect } from "react";
import { RecoilState, useRecoilValue, useSetRecoilState } from 'recoil'

export interface listState<T> {
  list: T[];
  curPage: number | null;
  loadedPages: number[];
  hasMore: boolean;
}

export const useLoadmore = <T>({
  fetchData,
  listState,
}: {
  fetchData: (page: number, limit?: number) => Promise<any>;
  listState: RecoilState<listState<T>>;
}): {
  loadNextPage: (n?: number) => Promise<boolean>;
  curPage: number | null;
  list: T[];
  hasMore: boolean;
  loading: boolean;
} => {
  const { list, curPage, loadedPages, hasMore } = useRecoilValue(listState)
  const setListState = useSetRecoilState(listState)
  const [ loading, setLoading ] = useState(false)
  const loadNextPage = async (page = typeof curPage === 'number' ? curPage + 1 : 0, config?: any) => {
    const { isForceFetch } = config || {}
    if (!isForceFetch) {
      if (loading) {
        return true
      }
      if (loadedPages.includes(page)) {
        return false
      }
    }

    setLoading(true)
    const resp = await fetchData(page)
    const { status, data } = resp
    if (status === 200 && data) {
      let _loadedPages = [...loadedPages]
      let _list = data
      if (page === 0) {
        _loadedPages = [page]
      }
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
    return Boolean(data?.length)
  }
  useEffect(() => {
    setListState(_state => ({
      ..._state,
      loadedPages: []
    }))
    loadNextPage(0, { isForceFetch: true })
  } , [fetchData])
  return {
    loadNextPage,
    curPage,
    list,
    hasMore,
    loading,
  }
}