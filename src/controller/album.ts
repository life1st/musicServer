import { createReadStream } from 'fs'
import { DEFAULT_LIMIT } from '../shareCommon/consts'
import { albumModel } from '../model/albumModel'
import { libraryModel } from '../model/libraryModel'
import { Music } from '../types/Music'
import { genAlbumInfo } from '../utils/album'
import { genCoverInfo } from '../utils/cover'
class Album {
    async getCover(albumId: string) {
        const album = await albumModel.getAlbum(albumId)
        if (album?.coverUrl) {
            return createReadStream(album.coverUrl)
        }
        return null
    }

    async getAlbum(id: string) {
        return albumModel.getAlbum(id)
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

        return albumModel.updateAlbum({
            musicId: music.id,
            albumInfo
        })
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
                await this.updateAlbum({
                    ...music,
                    coverUrl, coverId
                })
            }
        }
    }
}

const album = new Album()
export { album }
