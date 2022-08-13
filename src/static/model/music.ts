import { atom } from 'recoil'
import { Music } from '../../types/Music'

export const musicState = atom<{
  music: Music | null,
}>({
  key: 'musicState',
  default: {
    music: null,
  }
})

export const playListState = atom<{
  list: Music[],
  curIndex: number | null,
}>({
  key: 'playListState',
  default: {
    list: [],
    curIndex: null,
  }
})