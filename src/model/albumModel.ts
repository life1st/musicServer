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
        albumInfo: Album | { albumId: string },
        musicId: string
    }) {
        const LIMIT = 100 // per album only hold 100 songs
        const { albumId } = albumInfo
        const existAlbum = await this.db.findOne<Album>({albumId})
        let hasUpdate = false
        if (existAlbum) {
            if (existAlbum.musicIds.length < LIMIT) {
                const { coverId: existCoverId, name: existName } = existAlbum
                const curAlbumInfo = {
                    ...existAlbum,
                    musicIds: Array.from(new Set(existAlbum.musicIds.concat(musicId))),
                }
                if (!existCoverId) {
                    const { coverUrl, coverId } = albumInfo as Album
                    if (coverId) {
                        curAlbumInfo.coverId = coverId
                    }
                    if (coverUrl) {
                        curAlbumInfo.coverUrl = coverUrl
                    }
                }
                if (existName.includes('未知专辑') && albumInfo.name && !albumInfo.name.includes('未知专辑')) {
                    curAlbumInfo.name = albumInfo.name
                }
                hasUpdate = await this.db.update({ albumId }, curAlbumInfo, {}) > 0
            } else {
                // do nothing
            }
        } else {
            hasUpdate = await this.db.insert(albumInfo) !== null
        }
        return hasUpdate
    }

    async removeMusicFromAlbum(albumId: string, musicId: string) {
        const album = await this.db.findOne<Album>({albumId})
        if (album) {
            const { musicIds } = album
            const newMusicIds = musicIds.filter(id => id !== musicId)
            return await this.db.update({ albumId }, { ...album, musicIds: newMusicIds }, {}) > 0
        }
        return false
    }
    
    async deleteAlbum(id, config?: {
        _id: string;
    }) {
        if (id) {
            return await this.db.remove({ albumId: id }, {}) > 0
        }
        const { _id } = config || {}
        if (_id) {
            return await this.db.remove({ _id }, {}) > 0
        }
    }
}
const albumModel = new AlbumModel()

export { albumModel }
