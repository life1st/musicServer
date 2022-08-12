import fs from 'fs/promises'
import path from 'path'
import { getFileId, getMusicID3 } from './file'
import { Music } from '../types/Music'
export const genMusicKeyword = (music: Music) => {
  const {
    title = '', artist = '', album = '', genre = ''
  } = music
  return [title, artist, album, genre].filter(Boolean).join(' ')
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
  console.log('id, info: ', id, info, musicPath)

  const {
      title, artist = '', album = '', genre = '',
      trackNumber, unsynchronisedLyrics, 
  } = info
  const meta: Music = {
      id, path: musicPath,
      title: title || path.basename(musicPath), artist, album, genre,
      size: stat.size,
      extraInfo: {
          trackNumber, unsynchronisedLyrics, 
      }
  }
  
  return meta
}
