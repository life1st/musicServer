import fs from 'fs/promises'
import { createReadStream } from 'fs'
import os from 'os'
import path from 'path'
import { env } from '../utils/env'
import { getFileId, isMusicFile, getMusicID3 } from '../utils/file'

const HOME_DIR = os.homedir()
const CONFIG_DIR = env.isDev ? path.join(HOME_DIR, 'Documents/musicCenter/config') : path.resolve('/config')
const MUSIC_DIR = env.isDev ? path.join(HOME_DIR, 'Documents/music') : path.resolve('/music')

interface Music {
    title: string;
    artist: string;
    year: string;
}

class Library {
    isScanning = false
    musics = {}
    
    async scan() {
        if (!this.isScanning) {
            this.isScanning = true      
            let folderStack = [MUSIC_DIR]
            const musicList: [string] = []
            while(folderStack.length > 0) {
                const tmpFolders: [string] = []
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
                            musicList.push(fullPath);
                        } else if (stat.isDirectory()) {
                            tmpFolders.push(fullPath)
                        }
                    }
                }
                folderStack = tmpFolders
            }
            await this.updateMusicList(musicList)
            this.isScanning = false
            console.log('scan finish.')
        }
    }

    async updateMusicList(musicList: [string]) {
        let musics = await this.getMusicList()
        
        for (const file of musicList) {
            const [id, info] = await Promise.all([
                getFileId(file),
                getMusicID3(file)
            ])
            console.log('id, info: ', id, info)
            const {
                title, artist, album, genre, trackNumber, unsynchronisedLyrics, 
            } = info
            musics[id] = {
                id, path: file,
                info: {
                    title, artist, album, genre, trackNumber, unsynchronisedLyrics, 
                }
            }
        }
        
        fs.writeFile(path.join(CONFIG_DIR, `music_list0.json`), JSON.stringify(musics))
        this.musics = musics
        return musics
    }
    
    async getMusicList(pageNum = 0) {
        try {
            const config = await fs.readFile(path.join(CONFIG_DIR, `music_list0.json`))
            return JSON.parse(config)
        } catch (e) {
            console.log('handled:', e)
            return {}
        }
    }

    async getMusic(id) {
        if (!this.musics[id]) {
            this.musics = await this.getMusicList()
        }
        return createReadStream(this.musics[id].path)
    }
}
const library = new Library()

export { library }
