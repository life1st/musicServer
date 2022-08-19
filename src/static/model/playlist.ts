import { atom } from 'recoil'
import { Playlist } from '../../types/Playlist'

export const playlistState = atom<{
    list: Playlist[];
    loading: boolean;
}>({
    key: 'playlistState',
    default: {
        list: [],
        loading: false,
    },
})
