import fs from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { Tags } from 'node-id3'
import { getMusicID3, getFileId } from './file'
import { Music } from '../types/Music'
import { COVER_DIR } from './path'
import { getDir } from './file'
import { genAlbumInfo } from './album'

export const genCoverInfo = async (params: {
  music: Music,
  id3Tags?: Tags,
  coverBuf?: Buffer,
}): Promise<{
  coverUrl: string,
  coverId: string,
}> => {
    let { music, id3Tags, coverBuf } = params
    let coverUrl = ''
    let coverId = ''

    if (!id3Tags && music) {
      const { path } = music
      const musicBuf = await fs.readFile(path)
      id3Tags = await getMusicID3(musicBuf)
    }
    if (id3Tags && !coverBuf) {
      const { image } = id3Tags
      if (typeof image !== 'string' && image?.imageBuffer) {
        coverBuf = image.imageBuffer
      }
    }
    if (coverBuf) {
      const albumInfo = genAlbumInfo(music)
      const savePath = await saveCoverFile(coverBuf, albumInfo.albumId)
      if (savePath) {
        coverUrl = savePath
        coverId = await getFileId(coverBuf)
      }
    }

    return { coverUrl, coverId }
  }
  
  export const saveCoverFile = async (cover: Buffer, coverName: string, config: {
    overwrite?: boolean
  } = {}) => {
    const { overwrite = false } = config
    
    const coverPath = path.join(COVER_DIR, `${coverName}.jpg`)
    if (overwrite || !(existsSync(coverPath))) {
      try {
        await fs.writeFile(coverPath, cover)
        return coverPath
      } catch(e) {
        console.log('saveCoverFile error:', e)
        return null
      }
    }
  }
  
  getDir(COVER_DIR)