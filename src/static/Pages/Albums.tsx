import * as React from 'react'
import * as style from './Albums.module.less'
import { useNavigate } from 'react-router-dom'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { albumState, albumScrollState } from '../model/album'
import { getAlbums } from '../API'
import { Album } from '../../types/Album'
import { useLoadmore } from '../hooks/useLoadmore'
import { useCalColumn } from '../hooks/useCalColumn'
import Scroller from '../Components/Scroller'
import Cover from '../Components/Cover'

const { useRef, useMemo, useEffect } = React

const { origin } = window.location
const Album = (props: Album & {
  width?: number
}) => {
  const { name, albumId, width } = props
  const naviTo = useNavigate()
  const handleLClick = () => {
    naviTo('/album/' + albumId)
  }
  const styles = useMemo(() => {
    const mpw = 12 * 2 + 4 * 2 // margin + padding
    return width ? {
      container: {
        width: width - mpw,
      },
      cover:  {
        width: width - mpw,
        height: width - mpw
      }
    } : { container: {}, cover: {} }
  }, [width])
 
  return (
    <div className={style.albumContainer} title={name} style={styles.container}>
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

  const containerRef = useRef<HTMLElement>()
  const BASE_WIDTH = 116
  const itemWidth = useRef(BASE_WIDTH)
  useEffect(() => {
    // TODO: bug here, change route will cause x roll pos change
    // itemWidth.current = useCalColumn({baseWidth: BASE_WIDTH, containerRef})
  }, [])
  
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
      ref={containerRef}
    >
      { list.map(album => (
        <li key={album.albumId}><Album  {...album} width={itemWidth.current} /></li>
      )) }
    </Scroller>
  )
}

export default Albums
