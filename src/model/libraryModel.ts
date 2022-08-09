import path from 'path'
// import Nedb from 'nedb'
import Nedb from 'nedb-promises'
import { DB_DIR } from '../utils/path'
import { getDir, genFile } from '../utils/file'
import { genMusicKeyword } from '../utils/music'
import { Music } from '../types/Music'

const DEFAULT_LIMIT = 30

class LibraryModel {
    private dbFile = path.resolve(DB_DIR, 'libraryModel')
    private db = Nedb.create(this.dbFile)
    constructor() {
        getDir(DB_DIR)
    }

    async updateMusic(music: Music, prevId?: string): Promise<boolean> {
        music.keyword = genMusicKeyword(music)
        const id = prevId || music.id
        const hasExist = (await this.db.findOne({id})) !== null
        let hasUpdate = false
        if (hasExist) {
            hasUpdate = await this.db.update({id}, music, {}) > 0 
        } else {
            hasUpdate = (await this.db.insert(music)) !== null
        }
        return hasUpdate
    }

    async getMusic(id: string): Promise<Music> {
        return this.db.findOne({ id })
    }

    async getMusicList(page = 0, limit = DEFAULT_LIMIT): Promise<Music[]> {
        return this.db.find({}).skip(page * limit).limit(limit).exec()
    }

    async getMusicBy(
        query: {
            keyword?: string,
            title?: string,
        }, 
        pageNum: number
    ): Promise<Music[]> {
        const { title, keyword } = query
        const limit = DEFAULT_LIMIT
        if (keyword) {
            return this.db.find({keyword: {$regex: new RegExp(keyword)}}).skip(pageNum * limit).limit(limit).exec()
        } else if (title) {
            return this.db.find({title}).limit(limit).exec()
        } else {
            console.log(`getMusicBy didn't received any varible`)
            return Promise.reject(null)
        }
    }

    async deleteMusic(id: string): Promise<number> {
        return this.db.remove({ id }, {})
    }
}

const libraryModel = new LibraryModel()

export {
    libraryModel
}
