import path from 'path'
import Nedb from 'nedb-promises'
import { DB_DIR } from '../utils/path'
import { getDir } from '../utils/file'
import { libraryModel } from './libraryModel'
import { Album } from '../types/Album'

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

    async getAlbumListBy(
        param: { artist: string; },
        config: {
            pageNum: number;
            limit: number;
        }
    ) {
        const { artist } = param
        const { pageNum = 0, limit = 20 } = config
        
        return await this.db.find({artist}).skip(pageNum * limit).limit(limit).exec()
    }

    async updateAlbum({ albumInfo, musicId }: {
        albumInfo: Album, 
        musicId: string
    }) {
        const { albumId, coverUrl, coverId } = albumInfo
        const existAlbum = await this.db.findOne({albumId}) as Album
        let hasUpdate = false
        if (existAlbum) {
            const { coverId: existCoverId } = existAlbum
            const curAlbumInfo = {
                ...existAlbum,
                musicIds: existAlbum.musicIds.concat(musicId),
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
