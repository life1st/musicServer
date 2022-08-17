import { useState, useEffect, useCallback, useRef } from "react";
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
}, dep: string): {
  loadNextPage: (n?: number, config?: {}) => Promise<boolean>;
  curPage: number | null;
  list: T[];
  hasMore: boolean;
  loading: boolean;
} => {
  const { list, curPage, loadedPages, hasMore } = useRecoilValue(listState)
  const setListState = useSetRecoilState(listState)
  const [ loading, setLoading ] = useState(false)
  const loadDeps = useRef<string[]>([''])
  const loadNextPage = useCallback(async (page = typeof curPage === 'number' ? curPage + 1 : 0, config?: {
    deps?: string[];
  }) => {
    const { deps = [] } = config || {}
    const isDepsChange = deps.length !== loadDeps.current.length || deps.some(s => !loadDeps.current.includes(s))
    if (!isDepsChange) {
      if (loading) {
        return true
      }
      if (loadedPages.includes(page)) {
        return false
      }
    } else {
      loadDeps.current = deps
    }
    console.log(deps, deps.length, loadDeps.current.length, deps.some(s => !loadDeps.current.includes(s)), isDepsChange)

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
  }, [loading, loadedPages, fetchData])
  useEffect(() => {
    loadNextPage(0, { deps: [dep] })
  } , [fetchData, dep])
  return {
    loadNextPage,
    curPage,
    list,
    hasMore,
    loading,
  }
}