import path from 'path'
import fs from 'fs/promises'
import Nedb from 'nedb-promises'
import { DB_DIR } from '../utils/path'
import { getDir } from '../utils/file'
import { libraryModel } from './libraryModel'
import { Music } from '../types/Music'
import { Album } from '../types/Album'
import { getAlbumId } from '../utils/album'
import { genCoverInfo } from '../utils/cover'
import { genAlbumInfo } from '../utils/album'

class AlbumModel {
    private dbFile = path.resolve(DB_DIR, 'albumModel')
    private db = Nedb.create(this.dbFile)

    constructor() {
        getDir(DB_DIR)
    }

    async getAlbum(id) {
        const album = await this.db.findOne({albumId: id}) as Album
        if (album) {
            const songs = await libraryModel.getMusicListBy({ids: album.musicIds})            
            return { ...album, songs }
        }
        return null
    }

    async getAlbumListBy(param, config) {
        const { artist } = param
        const { pageNum = 0, limit = 20, needSongs = false } = config
        if (artist) {
            const list: Album[] = await this.db.find({artist}).skip(pageNum * limit).limit(limit).exec()
            if (needSongs) {
                const albumList = await Promise.all(list.map(async album => {
                    const songs = await libraryModel.getMusicListBy({ids: album.musicIds})
                    return { ...album, songs }
                }))
                return albumList
            }
            return list
        }
    }

    async updateAlbum(music: Music) {
        const { album, artist, coverUrl, coverId } = music
        const albumId = getAlbumId(music)
        const existAlbum = await this.db.findOne({albumId}) as Album
        let hasUpdate = false
        if (existAlbum) {
            const { coverId: existCoverId } = existAlbum
            const curAlbumInfo = {
                ...existAlbum,
                musicIds: [...existAlbum.musicIds, music.id],
            }
            if (!existCoverId) {
                if (coverId) {
                    curAlbumInfo.coverId = coverId
                }
                if (coverUrl) {
                    curAlbumInfo.coverUrl = coverUrl
                }
            }
            hasUpdate = await this.db.update({ albumId }, curAlbumInfo, {}) > 0
        } else {
            const albumInfo: Album = genAlbumInfo(music)
            hasUpdate = await this.db.insert(albumInfo) !== null
        }
        return hasUpdate
    }

    async createAlbumFromLibrary () {
        const LIMIT = 100
        let hasMore = true
        let page = 0
        while(hasMore) {
            const list = await libraryModel.getMusicList(page, LIMIT)
            if (list.length === 0) {
                hasMore = false
                break
            }
            for (const music of list) {
                const { coverUrl, coverId, coverBuf } = await genCoverInfo({ music })
                await this.updateAlbum({
                    ...music,
                    coverUrl, coverId
                })
            }
        }
    }
}
const albumModel = new AlbumModel()

export { albumModel }
