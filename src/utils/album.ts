import { Music } from "../types/Music"
import { Album } from "../types/Album"
import md5 from 'md5'
export const getAlbumId = (music: Music) => {
    const { album, artist } = music

    return md5(`${album}${artist}`)
}

export const genAlbumInfo = (music: Music): Album => {
    const { album, artist, coverUrl, coverId } = music
    const albumId = getAlbumId(music)
    const info: Album = {
        albumId, name: album, artist,
        musicIds: [music.id]
    }
    if (coverUrl) {
        info.coverUrl = coverUrl
    }
    if (coverId) {
        info.coverId = coverId
    }
    return info
}