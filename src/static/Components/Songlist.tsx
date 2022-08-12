import * as React from 'react'
import * as style from './Songlist.module.less'
import { musicState } from '../model/music'
import { useRecoilValue } from 'recoil'
import { Music } from '../../types/Music'
import { useThrottleFn } from 'ahooks'
const { useRef, useMemo } = React

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
    list: Music[];
    hasMore?: boolean;
    showLoading?: boolean;
}
const Songlist = (props: ILibrary) => {
    const { 
      list, hasMore, showLoading,
      onItemClick, onReachEnd
    } = props
    const { music: curPlaying } = useRecoilValue(musicState)
    const listRef = useRef<HTMLElement>()
    
    const handleItemClick = (item, i) => {
        onItemClick?.(item, i)
    }
    const { run: handleScroll, cancel, flush} = useThrottleFn(() => {
      if (listRef.current) {
        const { clientHeight, scrollTop, scrollHeight } = listRef.current
        if (clientHeight + scrollTop >= scrollHeight - 20) {
          onReachEnd?.()
        }
      }
    }, { wait: 300 })

    const renderEnd = () => {
      if (showLoading && hasMore) {
        return <img src={require('../imgs/ic-loading.svg')} className={style.iconEnd} />
      }
      if (!hasMore) {
        return (
          <div className={style.emptyTips}>
            <img src={require('../imgs/ic-empty.svg')} className={style.icEmpty} />
            <span className={style.tipsText}>没有了</span>
          </div>
        )
      }
      return null
    }

    return (
        <ul className={style.container} onScroll={handleScroll} ref={listRef}>
            { list.map((item, i) => (
                <SongItem 
                  key={item.id} 
                  music={item} 
                  onClick={() => { handleItemClick(item, i) }}
                  curPlaying={curPlaying}
                />
            )) }
            <li>{ renderEnd() }</li>
        </ul>
    )
}

export default Songlist