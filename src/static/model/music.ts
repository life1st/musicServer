import {
  atom
} from 'recoil'
import { Music } from '../../types/Music'

export const musicState = atom<{
  curIndex: number | null,
  music: Music | null,
}>({
  key: 'musicState',
  default: {
    curIndex: null,
    music: null,
  }
})
