import { atom, selector } from 'recoil'
import { Music } from '../../types/Music'

export const playingState = atom<{
  list: Music[],
  curIndex: number | null,
}>({
  key: 'playingState',
  default: {
    list: [],
    curIndex: null,
  }
})

export const musicState = selector({
  key: 'musicState',
  get: ({ get }) => {
    const {list, curIndex} = get(playingState)

    return {
      music: curIndex === null ? null : list[curIndex]
    }
  }
})

export const musicThemeState = atom<{
  themeColors: string[];
}>({
  key: 'musicThemeState',
  default: {
    themeColors: []
  }
})
