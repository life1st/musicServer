import { atom } from 'recoil'
import { Music } from '../../types/Music'

export const albumState = atom<Music[]>({
  key: 'albumState',
  default: [],
})

export const pageState = atom({
  key: 'pageState',
  default: 0,
})