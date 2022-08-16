import { useEffect } from 'react'
import { useFavicon, useTitle } from 'ahooks'
import { useRecoilValue } from 'recoil'
import { albumDetailState } from '../model/albumDetail'
import { musicState } from '../model/playing'
import { ROUTES } from '../router'
import { useMatch as TuseMatch } from 'react-router-dom'

const defaultFavicon = require('../imgs/favicon.png')

export const useGlobalTitle = (params: {
  useMatch: typeof TuseMatch
}) => {
  const { useMatch } = params
  const isMatchAlbumDetail = useMatch(ROUTES.ALBUM_DETAIL)
  const albumDetail = useRecoilValue(albumDetailState)
  const { music } = useRecoilValue(musicState)
  const coverUrl = albumId =>  `/file/album_cover/${albumId}`
  if (isMatchAlbumDetail && albumDetail) {
    useFavicon(coverUrl(albumDetail.albumId))
    useTitle(`${albumDetail.name} - ${albumDetail.artist}`)
    return
  }
  if (music) {
    useFavicon(coverUrl(music.albumId))
    useTitle(music.title)
    return
  }
  useFavicon(defaultFavicon)
  useTitle('Music Server')
}
