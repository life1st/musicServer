import path from 'path'
import Nedb from 'nedb-promises'
import { DB_DIR } from '../utils/path'
import { getDir } from '../utils/file'
import { genMusicKeyword } from '../utils/music'
import { genCoverInfo } from '../utils/cover'
import { Music } from '../types/Music'
import { DEFAULT_LIMIT } from '../shareCommon/consts'

class LibraryModel {
    private dbFile = path.resolve(DB_DIR, 'libraryModel')
    private db = Nedb.create(this.dbFile)
    constructor() {
        getDir(DB_DIR)
    }

    async getMusic(id: string): Promise<Music> {
        return this.db.findOne({ id })
    }

    async getMusicList(page = 0, limit = DEFAULT_LIMIT): Promise<Music[]> {
        return this.db.find({}).skip(page * limit).limit(limit).exec()
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

    async updateMusic(music: Music, params?: {
        prevId?: string,
        coverBuffer?: Buffer,
    }): Promise<boolean> {
        const { prevId, coverBuffer } = params || {}
        music.keyword = genMusicKeyword(music)
        const id = prevId || music.id
        const existMusic = await this.db.findOne({id}) as Music
        let hasUpdate = false
        const { coverId, coverUrl } = await genCoverInfo({ music, coverBuf: coverBuffer })
        if (existMusic) {
            const { coverId: prevCoverId } = existMusic
            if (!prevCoverId && coverId) {
                existMusic.coverId = coverId
                existMusic.coverUrl = coverUrl
            }
            hasUpdate = await this.db.update({id}, music, {}) > 0 
        } else {
            music.coverId = coverId
            music.coverUrl = coverUrl
            hasUpdate = await this.db.insert(music) !== null
        }
        return hasUpdate
    }

    async deleteMusic(id: string): Promise<number> {
        return this.db.remove({ id }, {})
    }
}

const libraryModel = new LibraryModel()

export {
    libraryModel
}
