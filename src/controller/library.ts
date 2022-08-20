import { createReadStream } from 'fs'
import child_process from 'child_process'
import os from 'os'
import { MUSIC_DIR } from '../utils/path'
import { updateMusicID3 } from '../utils/file'
import { getMusicData } from '../utils/music'
import { libraryModel } from '../model/libraryModel'
import { albumModel } from '../model/albumModel'
import { album as albumController } from './album'
import { Music } from '../types/Music'
import { RESP_STATE } from '../shareCommon/consts'
import { excludeProps, filterExistProps } from '../utils/obj'

class Library {
    isScanning = false
    scanningQueue: string[] = []
    finishQueue: Music[] = []

    async scanMulticore(config: {
        skipExist?: boolean,
        skipDeleted?: boolean,
    }) {
        const { skipExist = true, skipDeleted = true } = config || {}
        const startTime = Date.now()
        const processCount = os.cpus().length

        const musicProcessCount = processCount - 1 || 1
        const musicMetaTasks: string[] = Array(musicProcessCount).fill(null)
        let scanDirs = [MUSIC_DIR]
        let scanMusicCache: string[] = []

        let scanProcess = child_process.fork('./dist/scanDir.js')
        let musicMetaProcesses = Array(musicProcessCount).fill(null).map(() => child_process.fork('./dist/getMusicMeta.js'))
        let musicCount = 0
        musicMetaProcesses.map((process, pcsi) => {
            process.on('message', async (music: Music) => {
                console.log(`message from music process __${pcsi}__: `, music?.path)
                musicCount++
                const albumInfo = await albumController.updateAlbum(music)
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
                    // @ts-ignore
                    musicMetaTasks[i] = null
                    console.log('scan music cached 0', musicMetaTasks, musicMetaProcesses)
                    if (musicMetaTasks.every(t => !t) && scanMusicCache.length === 0) {
                        console.log(`scan finish. ProcessCount: ${musicMetaProcesses.length}, MusicCount:`, musicCount, (Date.now() - startTime) / 1000 + 's')
                        musicMetaProcesses = []
                    }
                }
            })
        })
        scanProcess.on('message', async ([dirs, musicFiles]: [string[], string[]]) => {
            console.log('message from scan process: ', dirs, musicFiles)
            if (dirs.length > 0) {
                scanDirs = scanDirs.concat(dirs.filter(dir => !['._', 'streams', 'thumb'].some(k => dir.includes(k))))
            }
            if (musicFiles.length > 0) {
                if (skipExist) {
                    let tmpList: string[] = []
                    for (const musicPath of musicFiles) {
                        const musics = await libraryModel.getMusicBy({ path: musicPath })
                        const isSkip = musics.length > 0
                        console.log('skipFile:', isSkip, musicPath, musics.length)
                        if (!isSkip) {
                            tmpList.push(musicPath)
                        }
                    }
                    musicFiles = tmpList
                }
                if (skipDeleted) {
                    let tmpList: string[] = []
                    for (const musicPath of musicFiles) {
                        const isDeleted = await libraryModel.getDeletedMusic({ path: musicPath })
                        console.log('skip deleted File:', Boolean(isDeleted), musicPath)
                        if (!isDeleted) {
                            tmpList.push(musicPath)
                        }
                    }
                    musicFiles = tmpList
                }
                scanMusicCache = scanMusicCache.concat(musicFiles)
            }
            musicMetaTasks.map((task, i) => {
                if (!task && scanMusicCache.length > 0) {
                    const curTask = scanMusicCache.pop() as string
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

    async scan(config: {
        skipExist?: boolean,
    }): Promise<[scanning: typeof this.scanningQueue, finishCount: number]> {
        if (!this.isScanning) {
            this.scanMulticore(config)
        }
        return [this.scanningQueue.slice(0, 10), this.finishQueue.length]
    }

    async getMusicList(pageNum): Promise<Music[]> {
        const music = await libraryModel.getMusicList(pageNum)
        return music.map(item => excludeProps(item, ['path', '_id']))
    }
    
    async getMusic(id, config?: {
        needStream: boolean;
    }) {
        const { needStream = true } = config || {}
        const music = await libraryModel.getMusic(id)
        const result: any = {}
        if (music) {
            result.music = excludeProps(music, ['_id'])
            result.size = music.size
            if (needStream) {
                const stream = createReadStream(music.path)
                const close = () => { stream.close() }
                stream.on('error', close)
                stream.on('en', close)
                result.stream = stream
            }
            return result
        }
        return null
    }

    async updateMeta(musicId, info) {
        const {
            title, artist, album, year, genre,
        } = info
        let tags = filterExistProps({
            title, artist, album, year, genre,
        })
        const music = await libraryModel.getMusic(musicId)

        let isSuccess = false
        if (music?.path) {
            const neddUpdateId3 = Object.keys(tags).some(k => tags[k] !== music[k])
            isSuccess = neddUpdateId3 ? await updateMusicID3(music.path, tags) : true
            if (isSuccess) {
                const musicMeta = neddUpdateId3 ? await getMusicData(music.path) : music
                await albumController.updateAlbum(musicMeta)
                return libraryModel.updateMusic(musicMeta, { prevId: musicId })
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
        const deleteNumber = await libraryModel.deleteMusic(id)
        return deleteNumber > 0 ? RESP_STATE.success : RESP_STATE.alreadyDone
    }
}
const library = new Library()

export { library }
