import { atom } from 'recoil'
import { Album } from '../../types/Album'
  
export const libraryState = atom<Album[]>({
    key: 'libraryState',
    default: [],
})

export const pageState = atom({
    key: 'pageState',
    default: 0,
})
