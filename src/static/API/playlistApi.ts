import axios from "axios"
import { Playlist } from '../../types/Playlist'
export const getPlaylists = (pageNum: number) => {
    const url = '/api/playlists'

    return axios.get(url, { params: {pageNum} })
}

export const createPlaylist = (playlist: Playlist) => {
    const url = '/api/playlist'

    return axios.post(url, playlist)
}

export const updatePlaylist = (id, playlist: Playlist) => {
    const url = '/api/playlist/' + id

    return axios.post(url, playlist)
}
