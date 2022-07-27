import { Music } from '../types/Music'
export const genMusicKeyword = (music: Music) => {
  const {
    title = '', artist = '', album = '', genre = ''
  } = music
  return [title, artist, album, genre].join(' ')
}
