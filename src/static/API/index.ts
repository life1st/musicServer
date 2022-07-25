import axios from 'axios'

export const getLibrary = (pageNum) => {
    const url = '/api/music_list/' + pageNum

    return axios.get(url)
}

export const scanLibrary = () => {
    const url = '/api/scan'

    return axios.post(url)
}
