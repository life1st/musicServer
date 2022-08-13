import { 
  atom,
} from 'recoil'
import { Music } from '../../types/Music'
import { listState } from '../hooks/useLoadmore'


export const libraryState = atom<listState<Music>>({
  key: 'libraryState',
  default: {
    list: [],
    curPage: null,
    loadedPages: [],
    hasMore: false,
  },
})

export const libraryScrollState = atom({
  key: 'libraryScrollState',
  default: 0,
})
