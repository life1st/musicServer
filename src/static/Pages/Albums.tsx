import * as React from 'react'
import * as style from './Albums.module.less'
import { useLibrary } from '../hooks/useLibrary'
import { getAlbums } from '../API'
import { Album } from '../../types/Album'

const { useCallback, useState } = React
const { origin } = window.location
const defaultCoverImg = require('../imgs/ic-album-default.svg')
const Album = (props: Album) => {
  const { name, albumId } = props
  const [ coverUrl, setCoverUrl ] = useState(`${origin}/file/album_cover/${albumId}`)

  const handleLoadError = () => {
    console.log(coverUrl)
    setCoverUrl(defaultCoverImg)
  }

  return (
    <div className={style.albumContainer} title={name}>
      <img src={coverUrl} onError={handleLoadError} className={style.albumCoverImg} />
      <p className={style.albumTitle}>{name}</p>
    </div>
  )
}

const Albums = () => {
  const fetchData = useCallback((pageNum) => {
    return getAlbums(pageNum)
  }, [])
  const { list, curPage } = useLibrary<Album>({fetchData})
  return (
    <div className={style.albumsContainer}>
      { list.map(album => (
        <Album key={album.albumId} {...album} />
      )) }
    </div>
  )
}

export default Albums
