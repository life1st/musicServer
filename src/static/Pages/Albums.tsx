import * as React from 'react'
import * as style from './Albums.module.less'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { albumState, albumScrollState } from '../model/album'
import { getAlbums } from '../API'
import { Album } from '../../types/Album'
import { useLoadmore } from '../hooks/useLoadmore'
import Scroller from '../Components/Scroller'

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
  const {list, loadNextPage, hasMore, loading, curPage} = useLoadmore({fetchData, listState: albumState})
  const memScrollTop = useRecoilValue(albumScrollState)
  const setAlbumScroll = useSetRecoilState(albumScrollState)
  
  const handleScroll = (scrollTop) => {
    setAlbumScroll(scrollTop)
  }
  const handleReachEnd = () => {
    if (!loading && hasMore) {
      loadNextPage()
    }
  }
  return (
    <Scroller
      initScrollTop={memScrollTop}
      className={style.albumsContainer}
      onScroll={handleScroll}
      onReachEnd={handleReachEnd}
      hasMore={hasMore}
      showLoading={hasMore}
    >
      { list.map(album => (
        <li key={album.albumId}><Album  {...album} /></li>
      )) }
    </Scroller>
  )
}

export default Albums
