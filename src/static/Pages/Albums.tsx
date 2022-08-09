import * as React from 'react'
import * as style from './Albums.module.less'

const Album = (props) => {
  const { coverUrl, name } = props

  return (
    <div className={style.albumContainer}>
      <img src={coverUrl || require('../imgs/ic-album-default.svg')} className={style.albumCoverImg} />
      <p className={style.albumTitle}>{name}</p>
    </div>
  )
}

const Albums = () => {
  const list = [
    {
      id: '123',
      coverUrl: require('../imgs/ic-album-default.svg'),
      name: 'Album 1',
    },{
      id: '1232',
      coverUrl: require('../imgs/ic-album-default.svg'),
      name: 'Album 2',
    },{
      id: '1233',
      coverUrl: require('../imgs/ic-album-default.svg'),
      name: 'Album 3',
    },{
      id: '1231',
      coverUrl: require('../imgs/ic-album-default.svg'),
      name: 'Album 4',
    },{
      id: '12311',
      coverUrl: require('../imgs/ic-album-default.svg'),
      name: 'Album 5',
    },{
      id: '123121',
      coverUrl: require('../imgs/ic-album-default.svg'),
      name: 'Album1 5',
    },{
      id: '1231212',
      coverUrl: require('../imgs/ic-album-default.svg'),
      name: 'Album1 7',
    },{
      id: '1231211',
      coverUrl: require('../imgs/ic-album-default.svg'),
      name: 'Album1 8',
    },
  ]

  return (
    <div className={style.albumsContainer}>
      { list.map(album => (
        <Album key={album.id} {...album} />
      )) }
    </div>
  )
}

export default Albums
