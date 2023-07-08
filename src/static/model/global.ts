import { atom } from 'recoil'

export const globalData = atom<{
  themeColors: string[];
  isWideScreen: boolean;
}>({
  key: 'globalData',
  default: {
    themeColors: [],
    isWideScreen: false,
  }
})
