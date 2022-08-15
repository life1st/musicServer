import * as React from 'react'
import * as style from './styles/Songlist.module.less'
import { useNavigate } from 'react-router-dom'
import { musicState, playingState } from '../model/playing'
import { useRecoilValue, useSetRecoilState } from 'recoil'
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
  onAddList?: (e: React.MouseEvent) => void;
}
const SongItem = (props: ItemProps) => {
  const { music, curPlaying, showAlbum = true } = props
  const { onClick = () => {}, onEdit = () => {}, onAddList = () => {} } = props
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
        <img src={require('../imgs/ic-list-add.svg')} className={style.icAddList} onClick={onAddList} />
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
    startNode?: React.ReactNode;
}
const Songlist = (props: ISonglist) => {
    const { 
      list, hasMore, initScrollTop, showLoading, className, showAlbum,
      onItemClick, onReachEnd, onScroll,
      startNode
    } = props
    const { music: curPlaying } = useRecoilValue(musicState)
    const { list: playingList } = useRecoilValue(playingState)
    const setPlayingList = useSetRecoilState(playingState)
    const naviTo = useNavigate()
    
    const handleItemClick = (item, i) => {
        onItemClick?.(item, i)
    }
    const handleItemEdit = (e, item, i) => {
      e.stopPropagation()
      naviTo(`/music/${item.id}/edit`)
    }
    const handleAddItemToList = (e, item) => {
      e.stopPropagation()
      if (!playingList.some(music => music.id === item.id)) {
        setPlayingList(_ => ({
          ..._,
          list: playingList.concat(item)
        }))
      }
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
        {props.startNode}
        { list.map((item, i) => (
          <SongItem 
            key={item.id} 
            music={item} 
            onClick={() => { handleItemClick(item, i) }}
            onEdit={(e) => { handleItemEdit(e, item, i) }}
            onAddList={(e) => { handleAddItemToList(e, item) }}
            curPlaying={curPlaying}
            showAlbum={showAlbum}
          />
        )) }
      </Scroller>
    )
}

export default Songlist