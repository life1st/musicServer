import { atom } from "recoil"
import { Album } from '../../types/Album'

export const albumDetailState = atom<Album | null>({
  key: 'albumDetailState',
  default: null,
})
