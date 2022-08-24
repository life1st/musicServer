import * as React from 'react'
import * as style from './styles/PlaylistEntry.module.less'
import dayJs from 'dayjs'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../consts'
import { getPlaylists } from '../API/playlistApi'
import { handleCreate } from '../utils/playlistHelper'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { playlistState } from '../model/playlist'
import { Playlist as IPlaylist } from '../../types/Playlist'
import Cover from './Cover'

const { useEffect } = React
const PlaylistItem = (props: IPlaylist & {
    onItemClick: (p: IPlaylist) => void;
}) => {
    const { onItemClick, ...playlist } = props
    const { title, updateTime, coverId } = playlist

    return (
        <div className={style.playlistItem} onClick={() => {onItemClick(playlist)}}>
            <Cover src={`/file/cover/${coverId}`} className={style.cover} />
            <div className={style.content}>
                <p className={style.title}>{title}</p>
                <p className={style.time}>{dayJs(updateTime).fromNow()}</p>
            </div>
            <img src={require('../imgs/arrow-down.svg')} className={style.icEntry} />
        </div>
    )
}

const PlaylistEntry = (props) => {
    const { list: playlists, loading } = useRecoilValue(playlistState)
    const setPlaylists = useSetRecoilState(playlistState)
    const fetchData = async () => {
        setPlaylists(_ => ({
            ..._,
            loading: true,
        }))
        const { status, data } = await getPlaylists(0)
        if (status === 200) {
            setPlaylists(_ => ({
                loading: false,
                list: data,
            }))
        }
    }
    useEffect(() => {
        fetchData()
    }, [])
    const naviTo = useNavigate()

    const handleItemClick = (pl) => {
        naviTo(ROUTES.PLAYLIST.replace(':id', pl.id))
    }
    return (
        <div className={style.container}>
            { playlists.length > 0 ? playlists.slice(0, 3).map(playlist => 
                <PlaylistItem key={playlist.id} {...playlist} onItemClick={handleItemClick} />
            ) : (
                <div className={style.createNew} onClick={handleCreate} >
                    <p className={style.title}>create new playlist {'->'}</p>
                </div>
            ) }
        </div>
    )
}

export { PlaylistEntry, PlaylistItem }
