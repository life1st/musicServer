import path from 'path'
import md5 from 'md5'
import { Music } from "../types/Music"
import { Album } from "../types/Album"

const getPathList = (p: string) => {
    const dirs = path.dirname(p).split(path.sep)
    const startAt = dirs.indexOf('music')

    return dirs.slice(startAt + 1)
}

export const getAlbumId = (music: Music) => {
    const { album, artist, path: musicPath } = music
    const dirs = getPathList(musicPath)
    const id = md5(dirs.reduce((acc, dir, i) => acc + dir, '') || 'root')

    return id
    // TODO: use config.json decide use path gen id || use mediatag
    // return md5(`${album}${artist}`)
}

export const genAlbumInfo = (music: Music): Album => {
    const { album, artist, year } = music
    const albumId = getAlbumId(music)
    const albumName = album || ('未知专辑-' + (artist || getPathList(music.path).shift() || 'root'))
    const info: Album = {
        albumId, name: albumName, artist, year,
        musicIds: [music.id]
    }

    return info
}