import { atom } from 'recoil'
import { Album } from '../../types/Album'

export const albumState = atom<Album[]>({
  key: 'albumState',
  default: [],
})

export const pageState = atom({
  key: 'pageState',
  default: 0,
})
