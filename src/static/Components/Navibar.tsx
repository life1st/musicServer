import * as React from 'react'
import * as style from './Navibar.module.less'
import icLibrary from '../imgs/ic-library.svg'
import icSearch from '../imgs/ic-search.svg'
import icPlayer from '../imgs/ic-play.svg'
import { useNavigate } from 'react-router-dom'

const Navibar = (props) => {
  const navigator = useNavigate()

  const menus = [{
      title: 'Playing',
      icon: icPlayer,
      onClick: () => { navigator('/player') }
    }, {
      title: 'Library',
      icon: icLibrary,
      onClick: () => { navigator('/library') }
    }, {
      title: 'Search',
      icon: icSearch,
      onClick: () => { navigator('/search') }
    }
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

export default Navibar