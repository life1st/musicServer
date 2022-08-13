import { atom } from 'recoil'
import { Music } from '../../types/Music'
import { listState } from '../hooks/useLoadmore'

export const searchListState = atom<listState<Music>>({
  key: 'searchListState',
  default: {
    list: [],
    curPage: null,
    hasMore: true,
    loadedPages: []
  }
})

export const searchPageState = atom<{
  scrollTop: number;
  searchText: string;
}>({
  key: 'searchPageState',
  default: {
    scrollTop: 0,
    searchText: ''
  }
})
