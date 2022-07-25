import fs from 'fs/promises'
import os from 'os'
import path from 'path'
import { env } from '../utils/env'
import { getFileId, isMusicFile } from '../utils/file'

const CONFIG_DIR = path.resolve('~/musicCenter/config')
const HOME_DIR = os.homedir()
const MUSIC_DIR = env.isDev ? path.join(HOME_DIR, 'Documents/music') : path.resolve('/music')

interface Music {
    title: string;
    artist: string;
    year: string;
}

class Library {
    isScanning = false
    
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
                        const stat = await fs.stat(fullPath)
                        if (name.includes('.mp3')){
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
        }
    }

    updateMusicList(musicList: [string]) {
        console.log('update', musicList)
    }
    async getMusicList(pageNum) {
        const config = fs.readFile(path.join(CONFIG_DIR, `music_list/${pageNum}.json`))
        return config
    }

    async getMusic(id) {
        return true
    }
}
const library = new Library()

export { library }
