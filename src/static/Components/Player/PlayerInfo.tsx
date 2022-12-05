import * as React from 'react'
import * as style from './Player.module.less'
import { ROUTES } from '../../consts'
import { useNavigate } from 'react-router-dom'
import { Music } from '../../../types/Music'

const PlayerInfo  = (props: Music | null) => {
  const naviTo = useNavigate()

  if (!props) {
      return (
          <p className={style.fullTitle}>No Playing</p>
      )
  }

  const { artist, album, albumId } = props
  const desc = artist && album ? `${artist} - ${artist}` : artist || album || ''
  const jumpToArtist = () => {
      naviTo(ROUTES.ALBUMS, {
          state: { q: artist }
      })
  }
  const jumpToAlbum = () => {
      if (!albumId) {
          return
      }
      naviTo(ROUTES.ALBUM_DETAIL.replace(':albumId', albumId))
  }
  return (
      <div title={desc} className={style.fullDesc}>
          { artist ? (
              <a onClick={jumpToArtist} className={style.partDesc}>{artist}</a>
          ) : null }
          { artist && album ? ('-') : null }
          { album ? (
              <a onClick={jumpToAlbum} className={style.partDesc}>{album}</a>
          ) : null }
      </div>
  )
}

export default PlayerInfo
