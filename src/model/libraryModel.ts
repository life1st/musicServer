import path from 'path'
import Nedb from 'nedb'
import { DB_DIR } from '../utils/path'
import { getDir, genFile } from '../utils/file'
import { genMusicKeyword } from '../utils/music'
import { Music } from '../types/Music'

const promiseResp = (resolve, reject, e, data) => {
    if (e) {
        reject(e)
        return
    }
    resolve(data)
}

class LibraryModel {
    private dbFile = path.resolve(DB_DIR, 'libraryModel')
    private db = new Nedb({ filename: this.dbFile, autoload: true })
    constructor() {
        getDir(DB_DIR)
    }

    async updateMusic(music: Music, prevId?: string): Promise<boolean> {
        music.keyword = genMusicKeyword(music)
        const id = prevId || music.id
        const hasExist: boolean = await new Promise((r, j) => {
            this.db.findOne({id}, (e, data) => {
                promiseResp(r, j, e, data)
            })
        })
        let hasUpdate = false
        if (hasExist) {
            hasUpdate = await new Promise((r, j) => {
                this.db.update({id}, music, {}, (e, data) => {
                    promiseResp(r, j, e, data)
                })
            })
        } else {
            hasUpdate =  await new Promise((r, j) => {
                this.db.insert(music, (e) => {
                    promiseResp(r, j, e, true)
                })
            })
        }
        return hasUpdate
    }

    async getMusic(id: string): Promise<Music> {
        return new Promise((r, j) => {
            this.db.findOne({ id }, (e, data) => {
                promiseResp(r, j, e, data)
            })
        })
    }

    async getMusicList(page = 0, limit = 10): Promise<Music[]> {
        return new Promise((r, j) => {
            this.db.find({}).skip(page * limit).limit(limit).exec((e, data) => {
                promiseResp(r, j, e, data)
            })
        })
    }

    async getMusicBy(query): Promise<Music[]> {
        const LIMIT = 10
        const { title, keyword } = query
        return new Promise((r, j) => {
            if (keyword) {
                this.db.find({keyword: {$regex: new RegExp(keyword)}}).limit(LIMIT).exec((e, data) => {
                    promiseResp(r, j, e, data)
                })
            } else if (title) {
                this.db.find({title}).limit(LIMIT).exec((e, data) => {
                    promiseResp(r, j, e, data)
                })
            } else {
                console.log(`getMusicBy didn't received any varible`)
                j(null)
            }
        })
    }

    async deleteMusic(id: string): Promise<number> {
        return new Promise((r, j) => {
            this.db.remove({ id }, {}, (e, data) => {
                promiseResp(r, j, e, data)
            })
        })
    }
}

const libraryModel = new LibraryModel()

export {
    libraryModel
}
