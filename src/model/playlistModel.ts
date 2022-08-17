import path from 'path'
import Nedb from 'nedb-promises'
import md5 from 'md5'
import { DB_DIR } from '../utils/path'
import { getDir } from '../utils/file'
import { Playlist } from '../types/Playlist'
import { DEFAULT_LIMIT } from '../shareCommon/consts'
import { Music } from '../types/Music'
import { libraryModel } from './libraryModel'

class PlaylistModel {
  private dbFile = path.resolve(DB_DIR, 'playlistModel')
  private db = Nedb.create(this.dbFile)

  constructor() {
    getDir(DB_DIR)
  }

  async getPlaylists({page, limit = DEFAULT_LIMIT}) {
    return this.db.find<Playlist>({}).skip(page * limit).limit(limit).exec()
  }

  async getPlaylist(id, config?: {
    needSongs?: boolean;
  }) {
    const { needSongs = false } = config || {}
    const playlist = await this.db.findOne<Playlist>({id})
    if (!needSongs || !playlist) {
      return playlist
    }
    const { musicIds } = playlist
    const songs = await libraryModel.getMusicListBy({ids: musicIds})
    return {
      ...playlist,
      songs,
    }
  }

  async createPlaylist(playlist: Playlist) {
    const createTime = new Date().toISOString()
    const updateTime = createTime
    const id = md5(playlist.title + createTime)
    return this.db.insert<Playlist>({
      ...playlist,
      id,
      createTime,
      updateTime,
      musicIds: []
    })
  }

  async updatePlaylist(id: string, music: Music) {
    const playlist = await this.db.findOne<Playlist>({id})
    if (playlist) {
      const { musicIds } = playlist
      const newMusicIds = Array.from(new Set(musicIds.concat(music.id)))
      return await this.db.update({id}, {
        ...playlist,
        updateTime: new Date().toISOString(),
        musicIds: newMusicIds,
      })
    } else {
      return false
    }
  }

  async deletePlaylist(id) {
    return this.db.remove({id}, {})
  }
}

const playlistModel = new PlaylistModel()
export { playlistModel }