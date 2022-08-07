import { 
  atom,
} from 'recoil'
import { Music } from '../../types/Music'


export const libraryState = atom<Music[]>({
  key: 'libraryState',
  default: [],
})

export const pageState = atom({
  key: 'pageState',
  default: 0,
})
