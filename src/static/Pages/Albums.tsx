import * as React from 'react'
import * as style from './styles/Albums.module.less'
import { useLocation, useNavigate } from 'react-router-dom'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { albumState, albumScrollState, albumPageState } from '../model/album'
import { getAlbums, searchAlbum } from '../API'
import { Album as IAlbum } from '../../types/Album'
import { useLoadmore } from '../hooks/useLoadmore'
import { useCalColumn } from '../hooks/useCalColumn'
import { Scroller } from '../Components/Scroller'
import Cover from '../Components/Cover'
import { SearchInput } from '../Components/SearchInput'
import { ROUTES } from '../consts'

const { useRef, useMemo, useEffect, useCallback, Fragment} = React

const { origin } = window.location
type ILocState = {
  q: string
} | null
const Album = (props: IAlbum & {
  width?: number
}) => {
  const { name, albumId, width } = props
  const naviTo = useNavigate()
  const handleLClick = () => {
    naviTo(ROUTES.ALBUM_DETAIL.replace(':albumId', albumId))
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
  const memScrollTop = useRecoilValue(albumScrollState)
  const setAlbumScroll = useSetRecoilState(albumScrollState)
  const { searchText } = useRecoilValue(albumPageState)
  const setAlbumPageState = useSetRecoilState(albumPageState)

  const fetchData = useCallback((pageNum: number) => {
    if (searchText) {
      return searchAlbum(searchText, pageNum)
    } else {
      return getAlbums(pageNum)
    }
  }, [searchText])

  const { list, loadNextPage, hasMore, loading, curPage } = useLoadmore({fetchData, listState: albumState}, searchText)

  const containerRef = useRef<HTMLElement>(null)
  const location = useLocation()
  useEffect(() => {
    const state = location.state as ILocState
    const notRefresh = list.length > 0
    if (state?.q && notRefresh) {
      handleSearch(state.q)
    }
  }, [location])

  const handleSearch = async (val: string) => {
    setAlbumPageState(state => ({
      ...state,
      searchText: val
    }))
  }
  const handleClearSearch = async () => {
    handleSearch('')
  }
  const handleReachEnd = () => {
    if (!loading && hasMore) {
      loadNextPage((curPage || 0) + 1, { deps: [searchText] })
    }
  }
  const BASE_WIDTH = 116
  const MIN_COLUMN = 3
  const { columnWidth, isDomReady } = useCalColumn({
    baseWidth: BASE_WIDTH,
    minColumn: MIN_COLUMN,
    containerRef
  })

  const sameAlbumCheck = (acc, a) => acc.some(al => al.albumId === a.albumId) ? acc : acc.concat(a)

  return (
    <Fragment>
      <SearchInput
        initText={searchText}
        autoFocus={false}
        onSearch={handleSearch}
        onClear={handleClearSearch}
      />
      <Scroller
        onScroll={setAlbumScroll}
        onReachEnd={handleReachEnd}
        initScrollTop={memScrollTop}
        className={style.albumsContainer}
        hasMore={hasMore}
        showLoading={hasMore}
        ref={containerRef}
      >
        { isDomReady ? list.reduce(sameAlbumCheck, []).map(album => (
          <li key={album.albumId} className={style.albumItem}>
            <Album {...album} width={columnWidth} />
          </li>
        )) : null }
      </Scroller>
    </Fragment>
  )
}

export default Albums
