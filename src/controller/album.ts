import { createReadStream } from 'fs'
import { DEFAULT_LIMIT } from '../shareCommon/consts'
import { albumModel } from '../model/albumModel'
import { libraryModel } from '../model/libraryModel'
import { Music } from '../types/Music'
import { genAlbumInfo } from '../utils/album'
import { genCoverInfo } from '../utils/cover'

const album2Cover = new Map()
class Album {
    async getCover(albumId: string) {
        let coverUrl = album2Cover.get(albumId)
        if (!coverUrl) {
            const album = await albumModel.getAlbum(albumId)
            if (album) {
                album2Cover.set(albumId, album?.coverUrl)
                coverUrl = album?.coverUrl
            }
        }
        if (album2Cover.size > 300) {
            album2Cover.clear()
        }
        if (coverUrl) {
            return createReadStream(coverUrl)
        }
        return null
    }

    async getAlbum(albumId: string) {
        return albumModel.getAlbum(albumId)
    }

    async getAlbumList({pageNum, artist, needSongs}: {
        pageNum: number,
        artist?: string,
        needSongs?: boolean
    }) {
        const limit = DEFAULT_LIMIT
        const albums = await albumModel.getAlbumListBy({artist}, { pageNum, limit })
        if (needSongs) {
            const albumList = await Promise.all(albums.map(async album => (
                { 
                    ...album, 
                    songs: await libraryModel.getMusicListBy({ids: album.musicIds}) 
                }
            )))
            return albumList
        }
        return albums
    }
    
    async updateAlbum(music: Music) {
        const albumInfo = genAlbumInfo(music)

        const hasUpdate = await albumModel.updateAlbum({
            musicId: music.id,
            albumInfo
        })
        return hasUpdate ? albumInfo : null
    }

    async createAlbumFromLibrary () {
        const LIMIT = 100
        let hasMore = true
        let page = 0
        while(hasMore) {
            const list = await libraryModel.getMusicList(page++, LIMIT)
            if (list.length === 0) {
                hasMore = false
                break
            }
            for (const music of list) {
                const { coverUrl, coverId, coverBuf } = await genCoverInfo({ music })
                console.log(coverUrl, coverId, music.album)
                const albumInfo = await this.updateAlbum({
                    ...music,
                    coverUrl, coverId
                })
                if (albumInfo) {
                    await libraryModel.updateMusic({
                        ...music,
                        albumId: albumInfo.albumId,
                    })
                }
            }
        }
    }
}

const album = new Album()
export { album }
