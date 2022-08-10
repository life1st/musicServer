import fs from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { Tags } from 'node-id3'
import { getMusicID3, getFileId } from './file'
import { Music } from '../types/Music'
import { COVER_DIR } from './path'

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
      const buf = await fs.readFile(path)
      id3Tags = await getMusicID3(buf)
    }
    if (id3Tags && !coverBuf) {
      const { image } = id3Tags
      if (image) {
        if (typeof image === 'string') {
          coverUrl = image
          coverId = `url-${image}`
        } else {
          coverBuf = image.imageBuffer
        }
      }
    }
    if (coverBuf) {
      const savePath = await saveCoverFile(coverBuf, music?.album || `未知专辑${music.title}`)
      if (savePath) {
        coverUrl = savePath
        coverId = await getFileId(coverBuf)
      }
    }

    return { coverUrl, coverId }
  }
  
  export const saveCoverFile = async (cover: Buffer, albumName: string, config: {
    overwrite?: boolean
  } = {}) => {
    const { overwrite = false } = config
    const coverPath = path.join(COVER_DIR, albumName)
    if (overwrite || !(existsSync(coverPath))) {
      await fs.writeFile(coverPath, cover)
    } else {
        return false
    }
    return coverPath
  }
  