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
        console.log(process.env.development)
        if (!this.isScanning) {
            this.isScanning = true      
            let folderStack = [MUSIC_DIR]
            console.log(folderStack)
            const musicList = []
            while(folderStack.length > 0) {
                const tmpFolders = []
                for (const folder of folderStack) {
                    const fsDirent = await fs.readdir(folder)
                    console.log(fsDirent)
                    for (const f of fsDirent) {
                        if (f.isDirectory()) {
                            tmpFolders.push(f)
                        } else {
                            musicList.push(f)
                        }
                    }
                }
                folderStack = tmpFolders
            }
            await this.updateMusicList(musicList)
            this.isScanning = false
        }
    }

    updateMusicList(musicList: [Music] | []) {
        
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
