import path from 'path'
import Nedb from 'nedb'
import { DB_DIR } from '../utils/path'
import { getDir, genFile } from '../utils/file'

const promisify = (fn, ...args) => {
    return new Promise((resolve, reject) => {
        fn(...args, (e, data) => {
            if (e) {
                reject(e)
                return
            }
            resolve(data)
        })
    })
}

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

    constructor() {
        getDir(this.dbFile)
    }

    private db = new Nedb({ filename: this.dbFile }).loadDatabase()

    async updateMusicList(music: Music) {
        console.log('library model -> update musicList: ', music)
        return promisify(this.db.insert, music)
    }

    async getMusic(id: string): Promise<Music> {
        return promisify(this.db.find, { id }) as Promise<Music> 
    }
}

const libraryModel = new LibraryModel()

export {
    libraryModel
}
