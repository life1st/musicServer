import path from 'path'
import Nedb from 'nedb-promises'
import { DB_DIR } from '../utils/path'
import { getDir } from '../utils/file'
import { Playlist } from '../types/Playlist'
import { DEFAULT_LIMIT } from '../shareCommon/consts'

class PlaylistModel {
  private dbFile = path.resolve(DB_DIR, 'playlistModel')
  private db = Nedb.create(this.dbFile)

  constructor() {
    getDir(DB_DIR)
  }

  async getPlaylist(id, config?: {
    needSongs?: boolean;
  }) {
    const { needSongs = false } = config || {}
    const playlist = await this.db.findOne<Playlist>({id})
  }
}