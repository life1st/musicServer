import path from 'path'
import md5 from 'md5'
import { Music } from "../types/Music"
import { Album } from "../types/Album"

export const getAlbumId = (music: Music) => {
    const { album, artist, path: musicPath } = music
    const dirs = path.dirname(musicPath).split(path.sep)
    const startAt = dirs.indexOf('music')
    const id = md5(dirs.reduce((acc, dir, i) => i <= startAt ? acc : acc + dir, '') || 'root')

    return id
    // TODO: use config.json decide use path gen id || use mediatag
    // return md5(`${album}${artist}`)
}

export const genAlbumInfo = (music: Music): Album => {
    const { album, artist, year } = music
    const albumId = getAlbumId(music)
    const info: Album = {
        albumId, name: album, artist, year,
        musicIds: [music.id]
    }

    return info
}