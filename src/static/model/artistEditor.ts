import { atom } from 'recoil'

export const artistState = atom({
  key: 'artistState',
  default: {
    name: '',
    cover: '',
  }
})