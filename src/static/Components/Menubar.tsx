import * as React from 'react'
import * as style from './styles/Menubar.module.less'
import cls from 'classnames'
import { useRecoilValue } from 'recoil'
import { CSSTransition } from 'react-transition-group'
import { Svg } from './Svg'
import { useNavigate, useMatch } from 'react-router-dom'
import { albumDetailState } from '../model/albumDetail'
import { ROUTES } from '../consts'

const { useMemo, useRef } = React

const MenuBar = (props) => {
  const navigator = useNavigate()
  const albumDetail = useRecoilValue(albumDetailState)

  const matchAlbumDetail = useMatch(ROUTES.ALBUM_DETAIL)
  const matchAlbums = useMatch(ROUTES.ALBUMS)
  const matchPlaying = useMatch(ROUTES.PLAYING)

  const params = useMemo(() => {
    return matchAlbumDetail ? { replace: true } : {}
  }, [matchAlbumDetail])
  const menus = [
    /* {
      title: 'Playing',
      icon: require('../imgs/ic-play.svg'),
      onClick: () => { navigator('/playing', params) }
    },  */
    {
      title: 'Albums',
      icon: require('../imgs/ic-album.svg'),
      onClick: () => {
        if (albumDetail?.albumId && !matchAlbumDetail && !matchAlbums) {
          navigator(`/album/${albumDetail.albumId}`, params)
        } else if (!matchAlbums) {
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

  const menubarRef = useRef<HTMLDivElement>(null)
  return (
    <CSSTransition
      in={!matchPlaying}
      nodeRef={menubarRef}
      timeout={200}
      classNames='menubar-transition'
    >
      <div className={cls(style.container, matchPlaying ? style.hide : '')} ref={menubarRef}>
        {menus.map(menu => (
          <div key={menu.title} className={style.menuItem} onClick={menu.onClick}>
            <Svg src={menu.icon} className={style.menuIcon} />
            <span className={style.menuText}>{menu.title}</span>
          </div>
        ))}
      </div>
    </CSSTransition>
  )
}

export default MenuBar