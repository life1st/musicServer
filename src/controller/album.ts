import { createReadStream } from 'fs'
import { DEFAULT_LIMIT } from '../shareCommon/consts'
import { albumModel } from '../model/albumModel'
import { libraryModel } from '../model/libraryModel'
import { Music } from '../types/Music'
import { Album as IAlbum } from '../types/Album'
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

    async getAlbum(albumId: string, config: { needSongs?: boolean } = {}) {
        return albumModel.getAlbum(albumId, config)
    }

    async getAlbumList({pageNum, artist, name, needSongs}: {
        pageNum: number,
        name?: string,
        artist?: string,
        needSongs?: boolean
    }) {
        const limit = DEFAULT_LIMIT
        const condition: any = {}
        if (artist) {
            condition.artist = { $regex: new RegExp(artist) }
        }
        if (name) {
            condition.name = { $regex: new RegExp(name) }
        }
        const albums = await albumModel.getAlbumListBy(condition, { pageNum, limit })
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
        let { albumId } = music
        let albumInfo = {} as IAlbum
        if (albumId) {
            const existAlbum = await albumModel.getAlbum(albumId)
            if (existAlbum) {
                albumInfo = existAlbum
            }
        }
        if (!albumId || !albumInfo.albumId) {
            albumInfo = genAlbumInfo(music)
        }
        if (!albumInfo.name) {
            return null
        }
        if (!albumInfo.coverId) {
            const { coverId, coverUrl } = await genCoverInfo({ music })
            albumInfo.coverId = coverId
            albumInfo.coverUrl = coverUrl
        }

        const hasUpdate = await albumModel.updateAlbum({
            musicId: music.id,
            albumInfo
        })
        return hasUpdate ? albumInfo : null
    }

    async deleteAlbum(albumId: string) {
        return albumModel.deleteAlbum(albumId)
    }

    async createAlbumFromLibrary() {
        const LIMIT = 100
        let page = 0
        const start = Date.now()
        while(true) {
            const list = await libraryModel.getMusicList(page++, LIMIT)
            if (list.length === 0) {
                break
            }
            for (const music of list) {
                const albumInfo = await this.updateAlbum(music)
                if (albumInfo) {
                    await libraryModel.updateMusic({
                        ...music,
                        albumId: albumInfo.albumId,
                    })
                }
            }
        }
        console.log('createAlbumFromLibrary finish', (Date.now() - start)/1000 + ' sec.')
        let albumPage = 0
        let deleteAlbumsCount = 0
        while (true) {
            const albumList = await this.getAlbumList({pageNum: albumPage++})
            if (albumList.length === 0) {
                break
            }
            for (const album of albumList) {
                if (!album.musicIds?.length) {
                    deleteAlbumsCount++
                    await albumModel.deleteAlbum(album.albumId, { _id: album._id })
                }
            }
        }
        console.log('delete empty album finish, count:', deleteAlbumsCount, (Date.now() - start)/1000 + ' sec.')
    }
}

const album = new Album()
export { album }
