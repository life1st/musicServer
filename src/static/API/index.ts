import axios from 'axios'

export const getLibrary = (pageNum) => {
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

export const searchMusic = (t: string) => {
    const url = `/api/search_music?q=` + t

    return axios.get(url)
}

export const deleteMusic = (id: string) => {
    const url = '/api/music/' + id

    return axios.delete(url)
}
