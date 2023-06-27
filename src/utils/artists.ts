import { ARTISTS_DIR } from './path'
import fs from 'fs/promises'
import path from 'path'
import { genFile, getDir } from './file'
import pinyin from 'pinyinlite'

interface Artist {
  name: string;
  pinyin: string;
  cover?: string;
}

const STORE_PATH = path.join(ARTISTS_DIR, 'artists.txt')
class ArtistsUtil {
  artists: Artist[] = []
  constructor() {
    getDir(ARTISTS_DIR)
    genFile(STORE_PATH)
    fs.readFile(STORE_PATH, { encoding: 'utf-8' }).then(value => {
      if (!value.length) {
        return
      }
      const artists = value.split('\n')
      this.artists = artists.map(artist => {
        const [name, pinyin, cover] = artist.split(' ')
        return { name, pinyin, cover }
      })
    })
  }
  getArtists() {
    return this.artists
  }
  insertArtist({name}) {
    if (this.artists.some(artist => artist.name === name)) {
      return
    } else {
      const _pinyin = pinyin(name).reduce((acc, cur) => {
        acc += cur[0] || ''
        return acc
      }, '')
      this.artists.push({ name, pinyin: _pinyin })
      this.saveArtists2File()
    }
  }

  cacheId: any = null
  saveArtists2File() {
    clearTimeout(this.cacheId)
    this.cacheId = setTimeout(() => {
      const fileData = this.artists.map(artist => `${artist.name} ${artist.pinyin} ${artist.cover}`).join('\n')
      fs.writeFile(STORE_PATH, fileData, { encoding: 'utf-8' })
    }, 0);
  }
}

export const artistUtil = new ArtistsUtil()