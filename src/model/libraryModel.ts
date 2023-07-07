import path from 'path'
import Nedb from 'nedb-promises'
import { DB_DIR } from '../utils/path'
import { getDir } from '../utils/file'
import { genMusicKeyword } from '../utils/music'
import { Music } from '../types/Music'
import { DEFAULT_LIMIT } from '../shareCommon/consts'

class LibraryModel {
    private dbFile = path.resolve(DB_DIR, 'libraryModel')
    private deletedLibrarydbFile = path.resolve(DB_DIR, 'deletedLibraryModel')
    private db = Nedb.create(this.dbFile)
    private deletedMusicdb = Nedb.create(this.deletedLibrarydbFile)
    constructor() {
        getDir(DB_DIR)
    }

    async getMusic(id: string) {
        return this.db.findOne<Music>({ id })
    }

    async getMusicList(page = 0, limit = DEFAULT_LIMIT) {
        return this.db.find<Music>({}).skip(page * limit).limit(limit).exec()
    }

    async getMusicListBy(params: {
        ids?: string[],
    }): Promise<Music[]> {
        const { ids } = params
        if (Array.isArray(ids)) {
            return this.db.find({ id: { $in: ids } })
        }
        return []
    }

    async getMusicBy(
        query: {
            keyword?: string,
            title?: string,
            path?: string,
            paths?: string[],
        }, 
        pageNum = 0
    ): Promise<Music[]> {
        const { title, keyword, path, paths } = query
        const limit = DEFAULT_LIMIT
        if (keyword) {
            let words = keyword.toLowerCase().split(' ')
            if (words.length > 2) {
                console.log('keywords too mach, only can detect 2.')
                words = words.slice(0, 2)
            }
            const regStr1 = `(.*${words.join('.*')}.*)`
            const regStr2 = `(.*${words.reverse().join('.*')}.*)`
            const reg = new RegExp(`${regStr1}|${regStr2}`)
            return this.db.find<Music>({keyword: {$regex: reg}}).skip(pageNum * limit).limit(limit).exec()
        } else if (title) {
            return this.db.find<Music>({title}).limit(limit).exec()
        } else if (path) {
            return this.db.find<Music>({path}).limit(limit).exec()
        } else {
            console.log(`getMusicBy didn't received any varible`)
            return Promise.reject(null)
        }
    }

    async updateMusic(
        music: Music, 
        params?: {
            prevId?: string,
        }
    ): Promise<boolean> {
        const { prevId } = params || {}
        music.keyword = genMusicKeyword(music)
        const id = prevId || music.id
        const existMusic = await this.db.findOne<Music>({id})
        let hasUpdate = false
        if (existMusic) {
            hasUpdate = await this.db.update({id}, {
                ...existMusic,
                ...music,
            }, {}) > 0 
        } else {
            hasUpdate = await this.db.insert(music) !== null
        }
        return hasUpdate
    }

    async deleteMusic(id: string, config?: {
        saveToDel: boolean
    }): Promise<number> {
        const { saveToDel = true } = config || {}
        if (saveToDel) {
            const music = await this.db.findOne({id})
            this.deletedMusicdb.insert(music)
        }
        return this.db.remove({ id }, {})
    }

    async getDeletedMusic({path}) {
        return this.deletedMusicdb.findOne({path})
    }
}

const libraryModel = new LibraryModel()

export {
    libraryModel
}
