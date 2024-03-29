import * as React from 'react'
import * as style from './styles/Songlist.module.less'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../consts'
import { musicState, playingState } from '../model/playing'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import cls from 'classnames'
import { Music } from '../../types/Music'
import { RESP_STATE } from '../../shareCommon/consts'
import { deleteMusic } from '../API'
import { Scroller } from './Scroller'
import { Svg } from './Svg'
import { parseTrackNumber } from '../utils/music'

const { useMemo } = React

interface ItemProps {
  curPlaying: Music | null;
  music: Music;
  showAlbum?: boolean;
  showTrackNumber?: boolean;
  onClick: () => void;
  onDelete: (e: React.MouseEvent) => void;
  onEdit: (e: React.MouseEvent) => void;
  onAddList?: (e: React.MouseEvent) => void;
}
const SongItem = (props: ItemProps) => {
  const { music, curPlaying, showAlbum = true, showTrackNumber } = props
  const { onClick = () => {}, onDelete = () => {}, onEdit = () => {}, onAddList = () => {} } = props
  const isPlaying = curPlaying?.id === music.id
  const desc = useMemo(() => {
    const { artist, album } = music
    if (artist && album && showAlbum) {
      return `${artist} - ${album}`
    }
    return artist || '未知歌手'
  }, [music])
  const index = parseTrackNumber(music.trackNumber)
  return (
    <li onClick={onClick} className={style.songItem} title={`${music.title} - ${desc}`}>
      { showTrackNumber ? <p className={style.index}>{index}</p> : null }
      <div className={style.content}>
        <p className={style.name} title={music.title}>{music.title}</p>
        <p className={style.desc}>{desc}</p>
      </div>
      <div className={style.opreation}>
        <Svg src={require('../imgs/ic-delete.svg')} className={style.icDelete} onClick={onDelete} />
        <Svg src={require('../imgs/ic-edit.svg')} className={style.icEdit} onClick={onEdit} />
        <Svg src={require('../imgs/ic-list-add.svg')} className={style.icAddList} onClick={onAddList} />
      </div>
      { isPlaying ? (
        <Svg src={require('../imgs/ic-cd.svg')} className={style.icPlaying} />
      ) : null }
    </li>
  )
}
interface ISonglist {
    onItemClick: (m: Music, n: number) => void;
    onReachEnd?: () => void;
    onScroll?: (scrollTop: number) => void;
    deleteSuccess?: (m: Music, s: RESP_STATE) => void;
    list: Music[];
    hasMore?: boolean;
    showLoading?: boolean;
    initScrollTop?: number;
    className?: string;
    showAlbum?: boolean;
    startNode?: React.ReactNode;
    showTrackNumber?: boolean;
}
const Songlist = (props: ISonglist) => {
    const { 
      list, hasMore, initScrollTop, showLoading, className, showAlbum, showTrackNumber,
      onItemClick, onReachEnd, onScroll, deleteSuccess
    } = props
    const { music: curPlaying } = useRecoilValue(musicState)
    const { list: playingList } = useRecoilValue(playingState)
    const setPlayingList = useSetRecoilState(playingState)
    const naviTo = useNavigate()
    
    const handleItemClick = (item, i) => {
        onItemClick?.(item, i)
    }
    const handleItemDelete = async (e, item) => {
      e.stopPropagation()
      const ensure = confirm(`确定删除${item.title}吗？`)
      if (ensure) {
        const { status, data } = await deleteMusic(item.id)
        if (status === 200) {
          deleteSuccess?.(item, data)
        }
      }
    }
    const handleItemEdit = (e, item, i) => {
      e.stopPropagation()
      naviTo(ROUTES.MUSIC_EDITOR.replace(':id', item.id))
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
            onDelete={(e) => { handleItemDelete(e, item, i) }}
            onEdit={(e) => { handleItemEdit(e, item, i) }}
            onAddList={(e) => { handleAddItemToList(e, item) }}
            curPlaying={curPlaying}
            showAlbum={showAlbum}
            showTrackNumber={showTrackNumber}
          />
        )) }
        {list.length ? <p className={style.endCount}>Songs: {list.length}</p> : null}
      </Scroller>
    )
}

export default Songlist