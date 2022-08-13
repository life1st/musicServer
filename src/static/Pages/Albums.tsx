import * as React from 'react'
import * as style from './Albums.module.less'
import { useNavigate } from 'react-router-dom'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { albumState, albumScrollState } from '../model/album'
import { getAlbums } from '../API'
import { Album } from '../../types/Album'
import { useLoadmore } from '../hooks/useLoadmore'
import Scroller from '../Components/Scroller'
import Cover from '../Components/Cover'

const { origin } = window.location
const Album = (props: Album) => {
  const { name, albumId } = props
  const naviTo = useNavigate()
  const handleLClick = () => {
    naviTo('/album/' + albumId)
  }

  return (
    <div className={style.albumContainer} title={name}>
      <Cover
        src={`${origin}/file/album_cover/${albumId}`} 
        className={style.albumCoverImg}
        onClick={handleLClick}
      />
      <p className={style.albumTitle}>{name}</p>
    </div>
  )
}

const Albums = () => {
  const { list, loadNextPage, hasMore, loading } = useLoadmore({fetchData: getAlbums, listState: albumState})
  const memScrollTop = useRecoilValue(albumScrollState)
  const setAlbumScroll = useSetRecoilState(albumScrollState)
  
  const handleReachEnd = () => {
    if (!loading && hasMore) {
      loadNextPage()
    }
  }
  return (
    <Scroller
      onScroll={setAlbumScroll}
      onReachEnd={handleReachEnd}
      initScrollTop={memScrollTop}
      className={style.albumsContainer}
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
