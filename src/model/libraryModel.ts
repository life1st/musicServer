import path from 'path'
import Nedb from 'nedb'
import { DB_DIR } from '../utils/path'
import { getDir, genFile } from '../utils/file'

export interface Music {
    id: string;
    path: string;
    title: string;
    artist: string;
    album: string;
    genre: string;
    size: string;
    extraInfo: {};
}

class LibraryModel {
    private dbFile = path.resolve(DB_DIR, 'libraryModel')
    private db
    constructor() {
        getDir(DB_DIR)
        this.db = new Nedb({ filename: this.dbFile })
        this.db.loadDatabase()
    }

    async updateMusicList(music: Music) {
        console.log('library model -> update musicList: ', music)
        return new Promise((r, j) => {
            this.db.insert(music, (e, data) => {
                if (e) {
                    j(e)
                    return
                }
                r(data)
            })
        })
    }

    async getMusic(id: string): Promise<Music> {
        return new Promise((r, j) => {
            this.db.find({ id }, (e, data) => {
                if (e) {
                    j(e)
                    return
                }
                r(data?.[0])
            })
        })
    }

    async getMusicList(page = 0, limit = 10) {
        return new Promise((r, j) => {
            this.db.find({}).skip(page).limit(limit).exec((e, data) => {
                if (e) {
                    j(e)
                    return
                }
                r(data)
            })
        })
    }
}

const libraryModel = new LibraryModel()

export {
    libraryModel
}
