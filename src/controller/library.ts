import fs from 'fs/promises'
import { createReadStream } from 'fs'
import path from 'path'
import { MUSIC_DIR } from '../utils/path'
import { getFileId, isMusicFile, getMusicID3, updateMusicID3 } from '../utils/file'
import { libraryModel } from '../model/libraryModel'
import { Music } from '../types/Music'

const excludeProps = (obj, excludes: string[]) => Object.keys(obj).reduce((acc, k) => {
    if (!excludes.includes(k)) {
        acc[k] = obj[k]
    }
    return acc;
}, {})

class Library {
    isScanning = false
    musics = {}
    
    async scan() {
        if (!this.isScanning) {
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
                            try {
                                const music = await this.getMusicData(fullPath)
                                await libraryModel.updateMusicList(music)
                            } catch (e) {
                                console.log('scan music error', fullPath, e)
                            }
                        } else if (stat.isDirectory()) {
                            tmpFolders.push(fullPath)
                        }
                    }
                }
                folderStack = tmpFolders
            }
            this.isScanning = false
            console.log('scan finish.')
        }
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

    async getMusicList(pageNum) {
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
        let tags = {
            title, artist, album
        }
        tags = Object.keys(tags).reduce((acc, k) => {
            if (tags[k]) {
                acc[k] = tags[k]
            }
            return acc
        }, {})
        const music = await libraryModel.getMusic(id)

        let isSuccess = false
        if (music.path) {
            isSuccess = await updateMusicID3(music.path, tags)
            if (isSuccess) {
                const musicMeta = await this.getMusicData(music.path)
                return libraryModel.updateMusic(musicMeta)
            }
        }
        return isSuccess
    }

    async searchMusic(keyWord) {
        const musicList =  await libraryModel.getMusicBy({title: keyWord})
        return musicList.map(item => excludeProps(item, ['path', '_id']))
    }
}
const library = new Library()

export { library }
