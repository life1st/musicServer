import axios from 'axios'
import { Album } from '../../types/Album'
import { Music } from '../../types/Music'

const buildKvStr = (obj) => Object.keys(obj).map(key => `${key}=${obj[key]}`).join('&')

export const getLibrary = (pageNum: number) => {
    const url = '/api/music_list/' + pageNum

    return axios.get(url)
}

export const scanLibrary = () => {
    const url = '/api/scan'

    return axios.post(url)
}

export const updateMeta = (id, tags) => {
    const url = '/api/music_meta/' + id

    return axios.post(url, tags)
}

export const getMusicMeta = (id) => {
    const url = '/api/music_meta/' + id

    return axios.get<{
        music: Music,
        size: string,
    }>(url)
}

export const searchMusic = (q: string, pageNum: number = 0) => {
    const url = `/api/search_music`

    return axios.get<Music[]>(url, { params: { q, pageNum } })
}

export const deleteMusic = (id: string) => {
    const url = '/api/music/' + id

    return axios.delete(url)
}

export const getAlbums = (pageNum: number = 0) => {
    const url = `/api/album_list/${pageNum}`

    return axios.get(url)
}

export const getAlbumDetail = (id: string, needSongs = true) => {
    const url = '/api/album/' + id

    return axios.get(url, { params: { needSongs } })
}

export const updateAlbumDetail = (id: string, albumDetail: Album) => {
    const url = '/api/album/' + id
    return axios.post(url, albumDetail)
}

export const searchAlbum = (q: string, pageNum: number = 0) => {
    const url = '/api/search_album'

    return axios.get<Album[]>(url, { params: { q, pageNum } })
}

export const sendAuth = (pw: string) => {
    const url = '/api/auth'

    return axios.post(url, {pw})
}

export const getAuthStatus = () => {
    const url = '/api/authed'

    return axios.get(url)
}
