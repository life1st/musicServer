import fs from 'fs/promises'
import { createReadStream } from 'fs'
import path from 'path'
import { MUSIC_DIR } from '../utils/path'
import { getFileId, isMusicFile, getMusicID3, updateMusicID3 } from '../utils/file'
import { libraryModel } from '../model/libraryModel'
import { Music } from '../types/Music'
import { RESP_STATE } from '../shareCommon/consts'

const excludeProps = <T>(obj: T, excludes: string[]): T => Object.keys(obj).reduce((acc, k) => {
    if (!excludes.includes(k)) {
        acc[k] = obj[k]
    }
    return acc;
}, {} as T)

const filterExistProps = <T>(obj: T): T => Object.keys(obj).reduce((acc, k) => {
    if (obj[k]) {
        acc[k] = obj[k]
    }
    return acc
}, {} as T)

class Library {
    isScanning = false
    scanningQueue: string[] = []
    finishQueue: Music[] = []

    async scan(): Promise<[scanning: typeof this.scanningQueue, finish: typeof this.finishQueue]> {
        const scanLibrary = async () => {
            console.log('scan start:', Date.now())
            this.finishQueue = []
            this.isScanning = true
            let folderStack = [MUSIC_DIR]
            while(folderStack.length > 0) {
                const tmpFolders: string[] = []
                console.log(folderStack)
                for (const folder of folderStack) {
                    const names = await fs.readdir(folder)
                    console.log(names)
                    for (const name of names) {
                        const fullPath = path.join(folder, name)
                        const [isMusic, stat] = await Promise.all([
                            isMusicFile(fullPath),
                            fs.stat(fullPath)
                        ])
                        if (isMusic){
                            this.scanningQueue.push(fullPath)
                            this.getMusicData(fullPath)
                            .then(music => libraryModel.updateMusic(music).then(() => music))
                            .then(music => {
                                this.scanningQueue = this.scanningQueue.filter(p => p !== music.path)
                                this.finishQueue.push(music)
                                if (this.scanningQueue.length === 0) {
                                    this.isScanning = false
                                    console.log('scan finished.', Date.now(), this.scanningQueue, this.finishQueue)
                                }
                            }).catch(e => {
                                console.log('scan music error', fullPath, e)
                            })
                        } else if (stat.isDirectory()) {
                            tmpFolders.push(fullPath)
                        }
                    }
                }
                folderStack = tmpFolders
            }
            console.log('scan done.', Date.now(), this.scanningQueue, this.finishQueue)
        }
        if (!this.isScanning) {
            scanLibrary()
        }
        return [this.scanningQueue, this.finishQueue]
    }

    async getMusicData(musicPath: string): Promise<Music> {

        const [ buf, stat ] = await Promise.all([
            fs.readFile(musicPath),
            fs.stat(musicPath)
        ])

        const [id, info] = await Promise.all([
            getFileId(buf),
            getMusicID3(buf)
        ])
        console.log('id, info: ', id, info, musicPath)

        const {
            title, artist = '', album = '', genre = '',
            trackNumber, unsynchronisedLyrics, 
        } = info
        return {
            id, path: musicPath,
            title: title || path.basename(musicPath), artist, album, genre,
            size: stat.size,
            extraInfo: {
                trackNumber, unsynchronisedLyrics, 
            }
        }
    }

    async getMusicList(pageNum): Promise<Music[]> {
        const music = await libraryModel.getMusicList(pageNum)
        return music.map(item => excludeProps(item, ['path', '_id']))
    }
    
    async getMusic(id) {
        const music = await libraryModel.getMusic(id)
        return {
            music,
            stream: createReadStream(music?.path), 
            size: music?.size
        }
    }

    async updateMeta(id, info) {
        const {
            title, artist, album, 
        } = info
        let tags = filterExistProps({
            title, artist, album
        })
        const music = await libraryModel.getMusic(id)

        let isSuccess = false
        if (music.path) {
            isSuccess = await updateMusicID3(music.path, tags)
            if (isSuccess) {
                const musicMeta = await this.getMusicData(music.path)
                return libraryModel.updateMusic(musicMeta, id)
            }
        }
        return isSuccess
    }

    async searchMusic(keyword: string) {
        let musicList: Music[] = []
        try {
            musicList = await libraryModel.getMusicBy({keyword})
        } catch (e) {
            musicList = []
        }
        if (musicList.length === 0) {
            try {
                musicList = await libraryModel.getMusicBy({title: keyword})
            } catch (e) {
                musicList = []
            }
        }
        return musicList.map(item => excludeProps(item, ['path', '_id']))
    }

    async deleteMusic(id) {
        const music = await libraryModel.getMusic(id)
        try {
            await fs.access(music.path)
            await fs.unlink(music.path)
        } catch (e) {
            console.log('music file not exist.', e)
        }
        const deleteNumber = await libraryModel.deleteMusic(id)
        return deleteNumber > 0 ? RESP_STATE.success : RESP_STATE.alreadyDone
    }
}
const library = new Library()

export { library }
