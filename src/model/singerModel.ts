import path from 'path'
import Nedb from 'nedb-promises'
import { DB_DIR } from '../utils/path'
import { getDir } from '../utils/file'
import { Singer } from '../types/Singer'
import { DEFAULT_LIMIT } from '../shareCommon/consts'

class SingerModel {
    private dbFile = path.resolve(DB_DIR, 'singerModel')
    private db = Nedb.create(this.dbFile)
    constructor() {
        getDir(DB_DIR)
    }

    async getSinger(id: string) {
        return this.db.findOne({ id })
    }

    async updateSinger(singer: Singer) {
        const { id } = singer
        const existSinger = await this.getSinger(id)
        if (existSinger) {
            return this.db.update({ id }, singer, {})
        } else {
            return this.db.insert(singer)
        }
    }

    async deleteSinger(id: string) {
        return this.db.remove({ id }, {})
    }

    async getSingerListBy(condition = {}, pageNum) {
        return this.db.find(condition).skip(pageNum * DEFAULT_LIMIT).limit(DEFAULT_LIMIT).exec()
    }
}

const singerModel = new SingerModel()
export { singerModel }