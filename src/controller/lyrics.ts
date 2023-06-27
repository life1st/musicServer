import { fetchLyrics, saveLyrics } from '../utils/lyrics'
import { LRC_DIR } from '../utils/path'
import fs from 'fs/promises'
import path from 'path'

class Lyrics {
  async getLyricsBy(params: {
    name?: string;
    artist?: string;
    musicId?: string;
  }) {
    const { name, artist = '', musicId } = params || {}
    try {
      const lrc = musicId && await fs.readFile(path.join(LRC_DIR, musicId), { encoding: 'utf-8'})
      if (lrc) {
        return lrc
      }
    } catch {
      console.log('lyric not exist in local')
    }
    if (!name) {
      return null
    }
    return fetchLyrics(name, artist)
  }

  async createLyric(params: {
    text: string;
    musicId: string;
  }) {
    const { text, musicId } = params
    return await saveLyrics(musicId, text)
  }
}

const lyrics = new Lyrics()
export default lyrics
