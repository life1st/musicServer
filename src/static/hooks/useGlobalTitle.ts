import { useEffect, useMemo, useRef } from 'react'
import { useTitle } from 'ahooks'
import { useRecoilValue } from 'recoil'
import { albumDetailState } from '../model/albumDetail'
import { musicState } from '../model/playing'
import { ROUTES } from '../utils/routesPath'
import { useMatch as TuseMatch } from 'react-router-dom'

const defaultFavicon = require('../imgs/favicon.png')

export const useFavicon = (href) =>  {
  const els = useRef<Element[]>([])
  useEffect(() => {
    if (!href) return
    /* 
      <link rel="apple-touch-icon-precomposed" href="./imgs/favicon.png">
      <link rel="shortcut icon" href="./imgs/favicon.png" />
      <link rel="icon" href="./imgs/favicon.png"> 
    */
  let elRels = ['icon', 'shortcut icon', 'apple-touch-icon-precomposed']
  if (!els.current?.length) {
    const eles = elRels.map(r => document.querySelector(`link[rel="${r}"]`)).map((el, i) => {
      if (!el) {
        const _el = document.createElement('link')
        _el.setAttribute('rel', elRels[i])
        document.head.appendChild(_el)
        return _el
      }
      return el
    })
    els.current = eles
  }
  els.current.map(el => {
    el.setAttribute('href', href)
  })
  }, [href])
}

export const useGlobalTitle = (params: {
  useMatch: typeof TuseMatch
}) => {
  const { useMatch } = params
  const isMatchAlbumDetail = useMatch(ROUTES.ALBUM_DETAIL)
  const albumDetail = useRecoilValue(albumDetailState)
  const { music } = useRecoilValue(musicState)
  const [ title, coverUrl ] = useMemo(() => {
    const genCoverUrl = albumId =>  `/file/album_cover/${albumId}`
    let _coverUrl = defaultFavicon
    let _title = 'Music Server'
    if (isMatchAlbumDetail && albumDetail) {
      return [
        `${albumDetail.name} - ${albumDetail.artist}`,
        genCoverUrl(albumDetail.albumId)
      ]
    } else if (music) {
      const { artist, albumId } = music
      if (albumId) {
        _coverUrl = genCoverUrl(albumId)
      }
      if (artist) {
        _title = `${music.title} - ${artist}`
      } else {
        _title = music.title
      }
    }
    return [_title, _coverUrl]
  }, [isMatchAlbumDetail, albumDetail, music])
  
  useFavicon(coverUrl)
  useTitle(title)
}
