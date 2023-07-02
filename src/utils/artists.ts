import { ARTISTS_DIR, UPLOAD_TMP_DIR } from './path'
import fs from 'fs/promises'
import { existsSync, createReadStream } from 'fs'
import path from 'path'
import { genFile, getDir } from './file'
import pinyin from 'pinyinlite'
import { libraryModel } from '../model/libraryModel'

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
        return { name: decodeURIComponent(name), pinyin, cover }
      })
    })
  }
  getArtists() {
    return this.artists
  }
  getCover(coverName) {
    return createReadStream(path.join(ARTISTS_DIR, encodeURIComponent(coverName)))
  }
  insertArtist({name}) {
    if (this.artists.some(artist => artist.name === name)) {
      return
    } else {
      const _pinyin = pinyin(name).reduce((acc, cur) => {
        const py = cur.sort((a, b) => a.charCodeAt(0) - b.charCodeAt(0))
        acc += py[0] || ''
        return acc
      }, '')
      this.artists.push({ name, pinyin: _pinyin })
      this.saveArtists2File()
    }
  }
  async updateArtist({name, covername }) {
    const index = this.artists.findIndex(artist => artist.name === name)
    if (index < 0) {
      return false
    }
    const coverTmpPath = path.join(UPLOAD_TMP_DIR, covername)
    if (!existsSync(coverTmpPath)) {
      return false
    }
    const savedCoverName = `${encodeURIComponent(name)}.${covername.split('.').pop()}`
    const coverPath = path.join(ARTISTS_DIR, savedCoverName)
    await fs.rename(coverTmpPath, coverPath)
    if (this.artists[index].cover) {
      try {
        await fs.unlink(this.artists[index].cover)
      } catch {
        console.log('delete failed.', this.artists[index])
      }
    }
    this.artists[index] = {
      ...this.artists[index],
      cover: savedCoverName,
    }
    this.saveArtists2File()
    return true
  }
  deleteArtist({name}) {
    this.artists = this.artists.filter(artist => artist.name !== name)
    this.saveArtists2File()
  }
  async scan() {
    let pageNum = 0
    const limit = 50
    while(true) {
      const musics = await libraryModel.getMusicList(pageNum, limit)
      musics.forEach(music => {
        this.insertArtist({ name: music.artist })
      })
      if (musics.length < limit) {
        break
      }
      pageNum++
    }
  }

  cacheId: any = null
  saveArtists2File() {
    clearTimeout(this.cacheId)
    this.cacheId = setTimeout(() => {
      const fileData = this.artists.map(artist => `${encodeURIComponent(artist.name)} ${artist.pinyin} ${artist.cover}`).join('\n')
      fs.writeFile(STORE_PATH, fileData, { encoding: 'utf-8' })
    }, 0);
  }
}

export const artistUtil = new ArtistsUtil()