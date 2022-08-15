import * as React from 'react'
import * as style from './AlbumDetail.module.less'
import { useParams, useNavigate } from 'react-router-dom'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { albumDetailState } from '../model/albumDetail'
import { musicState, playingState } from '../model/playing'
import { getAlbumDetail } from '../API'
import Navibar from '../Components/Navibar'
import Cover from '../Components/Cover'
import Songlist from '../Components/Songlist'

const { Fragment, useEffect } = React

const AlbumDetail = (props) => {
  const { albumId } = useParams()
  const albumDetail = useRecoilValue(albumDetailState)
  const setAlbumDetail = useSetRecoilState(albumDetailState)
  const setPlaying = useSetRecoilState(playingState)
  const naviTo = useNavigate()

  const handleBack = () => {
    naviTo('/albums', { replace: true })
  }
  const handleMusicItemClick = (music, i) => {
    const list = albumDetail?.songs || []
    setPlaying(_ => ({
      list,
      curIndex: i,
    }))
  }
  const fetchData = async (albumId) => {
    const { status, data } = await getAlbumDetail(albumId)
    if (status === 200 && typeof data !== 'string') {
      setAlbumDetail(data)
    }
  }
  useEffect(() => {
    if (albumId !== albumDetail?.albumId) {
      fetchData(albumId)
    }
  }, [albumId])

  return (
    <div className={style.container}>
      <Navibar onBack={handleBack} />
      {
        albumDetail ? (
          <Fragment>
            <div className={style.detailContent}>
              <Cover src={`/file/album_cover/${albumDetail.albumId}`} className={style.coverImg} />
              <div className={style.detailInfo}>
                <p className={style.title}>{albumDetail.name}</p>
                <p className={style.artist}>{albumDetail.artist}</p>
              </div>
            </div>
            <Songlist
              list={albumDetail.songs || []}
              hasMore={false}
              showLoading={false}
              onItemClick={handleMusicItemClick}
            />
          </Fragment>
        ) : (<div>Loading</div>)
      }
    </div>
  )
}

export default AlbumDetail
