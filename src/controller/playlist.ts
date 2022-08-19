import { Playlist as IPlaylist } from '../types/Playlist'
import { playlistModel } from '../model/playlistModel'
class Playlist {
  getPlaylists({page, limit}) {
    return playlistModel.getPlaylists({page, limit})
  }
  getPlaylist(id, config) {
    return playlistModel.getPlaylist(id, config)
  }
  createPlaylist(playlist: IPlaylist) {
    return playlistModel.createPlaylist(playlist)
  }
  updatePlaylist(id, music) {
    return playlistModel.updatePlaylist(id, music)
  }
  deletePlaylist(id) {
    return playlistModel.deletePlaylist(id)
  }
}

const playlist = new Playlist()
export { playlist }
