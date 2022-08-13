import fs from 'fs/promises'
import { createReadStream } from 'fs'
import path from 'path'
import child_process from 'child_process'
import os from 'os'
import { MUSIC_DIR } from '../utils/path'
import { isMusicFile, updateMusicID3 } from '../utils/file'
import { getMusicData } from '../utils/music'
import { libraryModel } from '../model/libraryModel'
import { album } from './album'
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

    async scanMulticore() {
        const startTime = Date.now()
        const processCount = os.cpus().length

        const musicProcessCount = processCount - 1 || 1
        const musicMetaTasks: string[] = Array(musicProcessCount).fill(null)
        let scanDirs = [MUSIC_DIR]
        let scanMusicCache: string[] = []

        let scanProcess = child_process.fork('./dist/scanDir.js')
        let musicMetaProcesses = Array(musicProcessCount).fill(null).map(() => child_process.fork('./dist/getMusicMeta.js'))
        let musicCount = 0
        musicMetaProcesses.map((process) => {
            process.on('message', async (music: Music) => {
                console.log('message from music process: ', music?.path)
                musicCount++
                
                const albumInfo = await album.updateAlbum(music)
                if (albumInfo) {
                    music.albumId = albumInfo.albumId
                }
                await libraryModel.updateMusic(music)

                const i = musicMetaTasks.findIndex(t => t === music.path)
                if (scanMusicCache.length > 0 && i >= 0) {
                    musicMetaTasks[i] = scanMusicCache.pop() as string
                    process.send(musicMetaTasks[i])
                } else {
                    process.kill('SIGINT')
                    // @ts-ignore
                    musicMetaProcesses[i] = null
                    if (musicMetaProcesses.every(p => p === null)) {
                        console.log('scan finish', musicCount, (Date.now() - startTime) / 1000 + 's')
                        if (scanProcess) {
                            scanProcess.kill('SIGINT')
                            // @ts-ignore
                            scanProcess = null
                        }
                    }
                }
            })
        })
        scanProcess.on('message', ([dirs, musicFiles]: [string[], string[]]) => {
            console.log('message from scan process: ', dirs, musicFiles)
            if (dirs.length > 0) {
                scanDirs = scanDirs.concat(dirs.filter(dir => !['._', 'streams', 'thumb'].some(k => dir.includes(k))))
            }
            if (musicFiles.length > 0) {
                scanMusicCache = scanMusicCache.concat(musicFiles)
            }
            musicMetaTasks.map((task, i) => {
                if (!task && scanMusicCache.length > 0) {
                    const curTask = scanMusicCache.pop() as string
                    console.log('curTask', curTask, i)
                    musicMetaTasks[i] = curTask
                    musicMetaProcesses[i].send(curTask)
                }
            })
            if (scanDirs.length > 0) {
                scanProcess.send(scanDirs.pop() as string)
            } else {
                scanProcess.kill('SIGINT')
                // @ts-ignore
                scanProcess = null
            }
        })
        scanProcess.send(scanDirs.pop() as string)
    }

    async scan(): Promise<[scanning: typeof this.scanningQueue, finish: typeof this.finishQueue]> {
        const scanLibrary = async () => {
            const startTime = Date.now()
            console.log('scan start:', startTime)
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
                            getMusicData(fullPath)
                            .then(music => libraryModel.updateMusic(music).then(() => music))
                            .then(music => {
                                this.scanningQueue = this.scanningQueue.filter(p => p !== music.path)
                                this.finishQueue.push(music)
                                if (this.scanningQueue.length === 0) {
                                    this.isScanning = false
                                    console.log('scan finished.', (Date.now() - startTime) / 1000 + 's', this.scanningQueue, this.finishQueue)
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
            // scanLibrary()
            this.scanMulticore()
        }
        return [this.scanningQueue, this.finishQueue]
    }

    async getMusicList(pageNum): Promise<Music[]> {
        const music = await libraryModel.getMusicList(pageNum)
        return music.map(item => excludeProps(item, ['path', '_id']))
    }
    
    async getMusic(id) {
        const music = await libraryModel.getMusic(id)
        if (music) {
            const stream = createReadStream(music.path)
            const close = () => { stream.close() }
            stream.on('error', close)
            stream.on('en', close)
            return {
                music,
                stream,
                size: music?.size
            }
        }
        return null
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
        if (music?.path) {
            isSuccess = await updateMusicID3(music.path, tags)
            if (isSuccess) {
                const musicMeta = await getMusicData(music.path)
                return libraryModel.updateMusic(musicMeta, { prevId: id })
            }
        }
        return isSuccess
    }

    async searchMusic(
        keyword: string,
        conf: {
            pageNum: number,
        }) {
        const { pageNum } = conf
        let musicList: Music[] = []
        try {
            musicList = await libraryModel.getMusicBy({keyword}, pageNum)
        } catch (e) {
            musicList = []
        }
        if (musicList.length === 0) {
            try {
                musicList = await libraryModel.getMusicBy({title: keyword}, pageNum)
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
