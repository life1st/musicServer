import path from 'path'
import Nedb from 'nedb-promises'
import { DB_DIR } from '../utils/path'
import { getDir } from '../utils/file'
import { libraryModel } from './libraryModel'
import { Album } from '../types/Album'
import { DEFAULT_LIMIT } from '../shareCommon/consts'

class AlbumModel {
    private dbFile = path.resolve(DB_DIR, 'albumModel')
    private db = Nedb.create(this.dbFile)

    constructor() {
        getDir(DB_DIR)
    }

    async getAlbum(id, config?:{
        needSongs?: boolean;
    }) {
        const { needSongs = false } = config || {}
        const album = await this.db.findOne<Album>({albumId: id})
        if (album && needSongs) {
            const songs = await libraryModel.getMusicListBy({ids: album.musicIds})            
            return { ...album, songs }
        }
        return album
    }

    async getAlbumListBy(
        condition: { 
            artist?: string | { $regex: RegExp };
            name?: string | { $regex: RegExp }
        },
        config: {
            pageNum: number;
            limit: number;
        }
    ) {
        const { pageNum = 0, limit = DEFAULT_LIMIT } = config
        return await this.db.find<Album>(condition).skip(pageNum * limit).limit(limit).exec()
    }

    async updateAlbum({ albumInfo, musicId }: {
        albumInfo: Album, 
        musicId: string
    }) {
        const { albumId, coverUrl, coverId } = albumInfo
        const existAlbum = await this.db.findOne<Album>({albumId})
        let hasUpdate = false
        if (existAlbum) {
            const { coverId: existCoverId } = existAlbum
            const curAlbumInfo = {
                ...existAlbum,
                musicIds: Array.from(new Set(existAlbum.musicIds.concat(musicId))),
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
            hasUpdate = await this.db.insert(albumInfo) !== null
        }
        return hasUpdate
    }
}
const albumModel = new AlbumModel()

export { albumModel }
