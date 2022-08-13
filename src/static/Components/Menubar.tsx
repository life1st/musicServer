import * as React from 'react'
import * as style from './styles/Menubar.module.less'
import { useNavigate } from 'react-router-dom'

const MenuBar = (props) => {
  const navigator = useNavigate()

  const menus = [{
      title: 'Playing',
      icon: require('../imgs/ic-play.svg'),
      onClick: () => { navigator('/playing') }
    }, {
      title: 'Albums',
      icon: require('../imgs/ic-album.svg'),
      onClick: () => { navigator('/albums') }
    }, {
      title: 'Library',
      icon: require('../imgs/ic-library.svg'),
      onClick: () => { navigator('/library') }
    }, {
      title: 'Search',
      icon: require('../imgs/ic-search.svg'),
      onClick: () => { navigator('/search') }
    },
  ]

  return (
    <div className={style.container}>
      {menus.map(menu => (
        <div key={menu.title} className={style.menuItem} onClick={menu.onClick}>
          <img src={menu.icon} className={style.menuIcon} />
          <span className={style.menuText}>{menu.title}</span>
        </div>
      ))}
    </div>
  )
}

export default MenuBar