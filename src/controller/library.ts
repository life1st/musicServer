import fs from 'fs/promises'
import { createReadStream } from 'fs'
import path from 'path'
import { CONFIG_DIR, MUSIC_DIR } from '../utils/path'
import { getFileId, isMusicFile, getMusicID3 } from '../utils/file'
import { libraryModel, Music } from '../model/libraryModel'

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
                                console.log('scan music error', fullPath)
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

        const buf = await fs.readFile(musicPath)
        const stat = await fs.stat(musicPath)

        const [id, info] = await Promise.all([
            getFileId(buf),
            getMusicID3(buf)
        ])
        console.log('id, info: ', id, info, musicPath)

        const {
            title = path.basename(musicPath), artist = '', album = '', genre = '',
            trackNumber, unsynchronisedLyrics, 
        } = info
        return {
            id, path: musicPath,
            title, artist, album, genre,
            size: stat.size,
            extraInfo: {
                trackNumber, unsynchronisedLyrics, 
            }
        }
    }
    
    async getMusic(id) {
        const music = await libraryModel.getMusic(id)
        return { 
            stream: createReadStream(music.path), 
            size: music.size
        }
    }
}
const library = new Library()

export { library }
