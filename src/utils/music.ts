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
  const dirKeywords = dirs.length > 2 ? [dirs.pop(), dirs.pop()].join(' ') : dirs.pop()

  const keywords = [title, artist, album, genre, dirKeywords]
  if (!title.includes(basename)) {
    keywords.push(basename)
  }
  return keywords.filter(Boolean).map(v => {
    const lowerStr = v?.toLowerCase()
    if (lowerStr === v) {
      return v
    }
    return `${v.toLowerCase()} ${v}`
  }).join(' ')
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
      trackNumber = '', unsynchronisedLyrics = '', year = '',
  } = info
  const meta: Music = {
      id, path: musicPath,
      title: title || path.basename(musicPath), 
      artist, album, genre, year,
      size: stat.size,
      trackNumber,
      extraInfo: {
          trackNumber, unsynchronisedLyrics, 
      }
  }
  
  return meta
}
