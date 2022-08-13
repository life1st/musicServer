import axios from 'axios'
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

export const searchMusic = (q: string, pageNum: number = 0) => {
    const url = `/api/search_music?${buildKvStr({
        q, pageNum
    })}`

    return axios.get<Music[]>(url)
}

export const deleteMusic = (id: string) => {
    const url = '/api/music/' + id

    return axios.delete(url)
}

export const getAlbums = (pageNum: number = 0) => {
    const url = `/api/album_list/${pageNum}`

    return axios.get(url)
}