import { atom } from 'recoil'
import { Album } from '../../types/Album'

export const albumState = atom<{
  list: Album[];
  curPage: number | null;
  loadedPages: number[];
  hasMore: boolean
}>({
  key: 'albumState',
  default: {
    list: [],
    curPage: null,
    loadedPages: [],
    hasMore: true,
  },
})

export const albumScrollState = atom<number>({
  key: 'albumScrollState',
  default: 0
})
