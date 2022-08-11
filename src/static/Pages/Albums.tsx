import * as React from 'react'
import * as style from './Albums.module.less'
import { useLibrary } from '../hooks/useLibrary'
import { getAlbums } from '../API'

const { useCallback } = React
const Album = (props) => {
  const { coverUrl, name } = props

  return (
    <div className={style.albumContainer}>
      <img src={coverUrl || require('../imgs/ic-album-default.svg')} className={style.albumCoverImg} />
      <p className={style.albumTitle}>{name}</p>
    </div>
  )
}

const Albums = () => {
  const fetchData = useCallback((pageNum) => {
    return getAlbums(pageNum)
  }, [])
  const { list, setCurPage, curPage } = useLibrary({fetchData})
  return (
    <div className={style.albumsContainer}>
      { list.map(album => (
        <Album key={album.id} {...album} />
      )) }
    </div>
  )
}

export default Albums
