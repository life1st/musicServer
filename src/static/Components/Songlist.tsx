import * as React from 'react'
import * as style from './styles/Songlist.module.less'
import { musicState } from '../model/music'
import { useRecoilValue } from 'recoil'
import cls from 'classnames'
import { Music } from '../../types/Music'
import Scroller from './Scroller'

const { useMemo } = React

interface ItemProps {
  curPlaying: Music | null;
  music: Music;
  onClick: () => void;
}
const SongItem = (props: ItemProps) => {
  const { music, curPlaying, onClick = () => {} } = props
  const isPlaying = curPlaying?.id === music.id
  const desc = useMemo(() => {
    const { artist, album } = music
    if (artist && album) {
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
      { isPlaying ? (
        <img src={require('../imgs/ic-cd.svg')} className={style.icPlaying} />
      ) : null }
    </li>
  )
}
interface ILibrary {
    onItemClick: (m: Music, n: number) => void;
    onReachEnd: () => void;
    onScroll?: (scrollTop: number) => void;
    list: Music[];
    hasMore?: boolean;
    showLoading?: boolean;
    initScrollTop?: number;
    className?: string;
}
const Songlist = (props: ILibrary) => {
    const { 
      list, hasMore, initScrollTop, showLoading, className,
      onItemClick, onReachEnd, onScroll
    } = props
    const { music: curPlaying } = useRecoilValue(musicState)
    
    const handleItemClick = (item, i) => {
        onItemClick?.(item, i)
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
            curPlaying={curPlaying}
          />
        )) }
        <li style={{height: 40}} />
      </Scroller>
    )
}

export default Songlist