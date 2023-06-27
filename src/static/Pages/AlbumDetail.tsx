import * as React from 'react'
import * as style from './styles/AlbumDetail.module.less'
import { useParams, useNavigate } from 'react-router-dom'
import { ROUTES } from '../consts'
import { useInViewport } from 'ahooks'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { albumDetailState } from '../model/albumDetail'
import { playingState } from '../model/playing'
import { Album } from '../../types/Album'
import { getAlbumDetail } from '../API'
import Navibar from '../Components/Navibar'
import Cover from '../Components/Cover'
import Songlist from '../Components/Songlist'
import { EndFix } from '../Components/Scroller'
import { Svg } from '../Components/Svg'
import { parseTrackNumber } from '../utils/music'

const { Fragment, useEffect, useRef } = React

const AlbumDetail = (props) => {
  const { albumId } = useParams()
  const albumDetail = useRecoilValue(albumDetailState)
  const setAlbumDetail = useSetRecoilState(albumDetailState)
  const setPlaying = useSetRecoilState(playingState)
  const naviTo = useNavigate()

  const handleBack = () => {
    naviTo(ROUTES.ALBUMS, { replace: true })
  }
  const handleMusicItemClick = (music, i) => {
    const list = albumDetail?.songs || []
    setPlaying(_ => ({
      list,
      curIndex: i,
    }))
  }
  const handleDeleted = (music, s) => {
    setAlbumDetail({
      ...albumDetail as Album,
      songs: albumDetail?.songs?.filter(m => m.id !== music.id) || []
    })
  }
  const handleEdit = () => {
    naviTo(ROUTES.ALBUM_EDITOR.replace(':id', albumDetail?.albumId))
  }
  const fetchData = async (albumId) => {
    const { status, data } = await getAlbumDetail(albumId)
    if (status === 200 && typeof data !== 'string') {
      setAlbumDetail({
        ...data,
        songs: data.songs.sort((a, b) => parseTrackNumber(a.trackNumber) - parseTrackNumber(b.trackNumber))
      })
    }
  }
  useEffect(() => {
    if (albumId !== albumDetail?.albumId) {
      fetchData(albumId)
    }
  }, [albumId])

  const titleRef = useRef<HTMLParagraphElement>(null)
  const [ titleInView ] = useInViewport(titleRef)
  const jumpToArtist = () => {
    naviTo(ROUTES.ALBUMS, {
      state: {
        q: albumDetail?.artist
      }
    })
  }

  const hasCurData = albumDetail && albumDetail.albumId === albumId
  const hideTitleInNavi = titleInView === undefined || titleInView || !hasCurData
  return (
    <div className={style.container}>
      <Navibar onBack={handleBack} title={hideTitleInNavi ? null : albumDetail?.name} />
      {
        hasCurData ? (
          <Fragment>
            <Songlist
              startNode={(
                <div className={style.detailContent}>
                  <Cover src={`/file/album_cover/${albumDetail.albumId}`} className={style.coverImg} />
                  <div className={style.detailInfo}>
                    <p className={style.title} ref={titleRef}>{albumDetail.name}</p>
                    <p className={style.artist} onClick={jumpToArtist}>{albumDetail.artist}</p>
                    { albumDetail.year ? 
                        <p className={style.year}>{albumDetail.year}</p> 
                    : null }
                    <div className={style.oprations}>
                      <Svg src={require('../imgs/ic-edit.svg')} className={style.icEdit} onClick={handleEdit} />
                    </div>
                  </div>
                </div>
              )}
              list={albumDetail.songs || []}
              hasMore={false}
              showLoading={false}
              onItemClick={handleMusicItemClick}
              deleteSuccess={handleDeleted}
              showAlbum={false}
              showTrackNumber={true}
            />
          </Fragment>
        ) : (
          <div><EndFix showLoading={true} hasMore={true} /></div>
        )
      }
    </div>
  )
}

export default AlbumDetail
