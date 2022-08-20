import axios from "axios"
import { Playlist } from '../../types/Playlist'
export const getPlaylists = (pageNum: number) => {
    const url = '/api/playlists'

    return axios.get(url, { params: {pageNum} })
}

export const getPlaylist = (id) => {
    const url = '/api/playlist/' + id

    return axios.get(url, { params: {needSongs: true} })
}

export const createPlaylist = (playlist: Omit<
    Playlist, 'updateTime' | 'createTime' | 'id' | 'musicIds'
>) => {
    const url = '/api/playlist'

    return axios.post(url, playlist)
}

export const updatePlaylist = (id, playlist: Playlist) => {
    const url = '/api/playlist/' + id

    return axios.post(url, playlist)
}

export const deletePlaylist = (id) => {
    const url = `/api/playlist/` + id

    return axios.delete(url)
}
