import fs from 'fs/promises'
import path from 'path'
import { getFileId, getMusicID3 } from './file'
import { Music } from '../types/Music'
export const genMusicKeyword = (music: Music) => {
  const {
    title = '', artist = '', album = '', genre = '',
    path: musicPath = '',
  } = music

  const extname = path.extname(musicPath)
  const [
    dirs,
    basename,
  ] = [
    path.dirname(musicPath).split(path.sep),
    path.basename(musicPath, extname),
  ]
  const dirKeywords = dirs.length > 2 ? [dirs.pop(), dirs.pop()] : [dirs.pop()]

  const keywords = [title, artist, album, genre, ...dirKeywords].filter(Boolean) as string[]
  if (!title.includes(basename)) {
    keywords.push(basename)
  }
  return keywords.reduce((acc, v) => {
    if (acc.some(w => w.includes(v))) {
      return acc
    }
    const lowerStr = v.toLowerCase()
    if (lowerStr === v) {
      return acc.concat([v]) 
    }
    return acc.concat([lowerStr, v])
  }, [] as string[]).join(' ')
}

export const getMusicData = async (musicPath: string): Promise<Music> => {

  const [ buf, stat ] = await Promise.all([
      fs.readFile(musicPath),
      fs.stat(musicPath)
  ])

  const [id, info] = await Promise.all([
      getFileId(buf),
      getMusicID3(buf)
  ])

  const {
      title, artist = '', album = '', genre = '',
      trackNumber, unsynchronisedLyrics, year,
  } = info
  const meta: Music = {
      id, path: musicPath,
      title: title || path.basename(musicPath), 
      artist, album, genre, year,
      size: stat.size,
      extraInfo: {
          trackNumber, unsynchronisedLyrics, 
      }
  }
  
  return meta
}
