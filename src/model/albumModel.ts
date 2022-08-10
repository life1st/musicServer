import path from 'path'
import fs from 'fs/promises'
import Nedb from 'nedb-promises'
import { DB_DIR } from '../utils/path'
import { getDir } from '../utils/file'
import { libraryModel } from './libraryModel'
import { Music } from '../types/Music'
import { Album } from '../types/Album'

class AlbumModel {
    private dbFile = path.resolve(DB_DIR, 'albumModel')
    private db = Nedb.create(this.dbFile)

    constructor() {
        getDir(DB_DIR)
    }

    async getAlbumListBy(param) {
        const { artist } = param
        if (artist) {
            return this.db.find({artist})
        }
    }

    async createAlbumFromLibrary () {
        const LIMIT = 100
        let hasMore = true
        let page = 0
        const albumNames: string[] = []
        while(hasMore) {
            const list = await libraryModel.getMusicList(page, LIMIT)
            if (list.length === 0) {
                hasMore = false
                break
            }
            list.forEach(music => {
                if (!albumNames.includes(music.album)) {
                    albumNames.push(music.album)
                    this.updateAlbum(music)
                }
            })
        }
    }

    async updateAlbum(music: Music) {
        const { album, artist, coverUrl } = music
        const existAlbum = await this.db.findOne({album, artist}) as Album
        let hasUpdate = false
        if (existAlbum) {
            
            const { coverId: existCoverId } = existAlbum
            
            hasUpdate = await this.db.update({album, artist}, music, {}) > 0
        } else {
            const albumInfo: Album = 
            hasUpdate = await this.db.insert() !== null
        }
        return hasUpdate
    }

    
}
const albumModel = new AlbumModel()

export { albumModel }
