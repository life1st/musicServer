import * as React from 'react'
import * as style from './styles/Songlist.module.less'
import { useNavigate } from 'react-router-dom'
import { musicState } from '../model/playing'
import { useRecoilValue } from 'recoil'
import cls from 'classnames'
import { Music } from '../../types/Music'
import Scroller from './Scroller'

const { useMemo } = React

interface ItemProps {
  curPlaying: Music | null;
  music: Music;
  showAlbum?: boolean;
  onClick: () => void;
  onEdit: (e: React.MouseEvent) => void;
}
const SongItem = (props: ItemProps) => {
  const { music, curPlaying, showAlbum = true } = props
  const { onClick = () => {}, onEdit = () => {} } = props
  const isPlaying = curPlaying?.id === music.id
  const desc = useMemo(() => {
    const { artist, album } = music
    if (artist && album && showAlbum) {
      return `${artist} - ${album}`
    }
    return artist || '未知歌手'
  }, [music])
  return (
    <li onClick={onClick} className={style.songItem}>
      <div className={style.content}>
        <p className={style.name} title={music.title}>{music.title}</p>
        <p className={style.desc}>{desc}</p>
      </div>
      <div className={style.opreation}>
        <img src={require('../imgs/ic-edit.svg')} className={style.icEdit} onClick={onEdit} />
      </div>
      { isPlaying ? (
        <img src={require('../imgs/ic-cd.svg')} className={style.icPlaying} />
      ) : null }
    </li>
  )
}
interface ISonglist {
    onItemClick: (m: Music, n: number) => void;
    onReachEnd?: () => void;
    onScroll?: (scrollTop: number) => void;
    list: Music[];
    hasMore?: boolean;
    showLoading?: boolean;
    initScrollTop?: number;
    className?: string;
    showAlbum?: boolean;
}
const Songlist = (props: ISonglist) => {
    const { 
      list, hasMore, initScrollTop, showLoading, className, showAlbum,
      onItemClick, onReachEnd, onScroll
    } = props
    const { music: curPlaying } = useRecoilValue(musicState)
    const naviTo = useNavigate()
    
    const handleItemClick = (item, i) => {
        onItemClick?.(item, i)
    }
    const handleItemEdit = (e, item, i) => {
      e.stopPropagation()
      naviTo(`/music/${item.id}/edit`)
    }

    return (
      <Scroller
        onScroll={onScroll}
        onReachEnd={onReachEnd}
        hasMore={hasMore}
        showLoading={showLoading}
        initScrollTop={initScrollTop}
        className={cls(style.container, className)}
      >
        { list.map((item, i) => (
          <SongItem 
            key={item.id} 
            music={item} 
            onClick={() => { handleItemClick(item, i) }}
            onEdit={(e) => { handleItemEdit(e, item, i) }}
            curPlaying={curPlaying}
            showAlbum={showAlbum}
          />
        )) }
      </Scroller>
    )
}

export default Songlist