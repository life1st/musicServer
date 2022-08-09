import path from 'path'
import Nedb from 'nedb'
import { DB_DIR } from '../utils/path'
import { getDir } from '../utils/file'

class AlbumModel {
    private dbFile = path.resolve(DB_DIR, 'albumModel')
    private db = new Nedb({ filename: this.dbFile, autoload: true })

    constructor() {
        getDir(DB_DIR)
    }

    async getAlbumListBy(param) {
        const { artist } = param
        if (artist) {
            return this.db.find({artist})
        }
    }
}