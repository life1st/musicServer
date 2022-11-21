import * as React from 'react'
import * as style from './styles/Menubar.module.less'
import { Svg } from './Svg'
import { useNavigate, useMatch } from 'react-router-dom'
import { albumDetailState } from '../model/albumDetail'
import { useRecoilValue } from 'recoil'
import { ROUTES } from '../consts'

const { useMemo } = React

const MenuBar = (props) => {
  const navigator = useNavigate()
  const albumDetail = useRecoilValue(albumDetailState)

  const matchAlbumDetail = useMatch(ROUTES.ALBUM_DETAIL)

  const params = useMemo(() => {
    return matchAlbumDetail ? { replace: true } : {}
  }, [matchAlbumDetail])
  const menus = [{
      title: 'Playing',
      icon: require('../imgs/ic-play.svg'),
      onClick: () => { navigator('/playing', params) }
    }, {
      title: 'Albums',
      icon: require('../imgs/ic-album.svg'),
      onClick: () => {
        if (albumDetail?.albumId) {
          navigator(`/album/${albumDetail.albumId}`, params)
        } else {
          navigator('/albums', params)
        }
      }
    }, {
      title: 'Library',
      icon: require('../imgs/ic-library.svg'),
      onClick: () => { navigator('/library', params) }
    }, {
      title: 'Search',
      icon: require('../imgs/ic-search.svg'),
      onClick: () => { navigator('/search', params) }
    },
  ]

  return (
    <div className={style.container}>
      {menus.map(menu => (
        <div key={menu.title} className={style.menuItem} onClick={menu.onClick}>
          <Svg src={menu.icon} className={style.menuIcon} />
          <span className={style.menuText}>{menu.title}</span>
        </div>
      ))}
    </div>
  )
}

export default MenuBar