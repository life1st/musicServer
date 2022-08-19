import * as React from 'react'
import * as style from './styles/PlaylistEntry.module.less'
import cls from 'classnames'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../router'
import { getPlaylists } from '../API/playlistApi'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { playlistState } from '../model/playlist'
const { useEffect } = React

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
            { playlists.length > 0 ? playlists.slice(0, 3).map(playlist => (
                <div key={playlist.id} className={style.item} onClick={() => {handleItemClick(playlist)}}>
                    <p className={style.title}>{playlist.title}</p>
                    <p className={style.time}>
                        {playlist.updateTime}
                    </p>
                </div>
            )) : (
                <div className={cls(style.item, style.createNew)}>
                    <p className={style.title}>create new playlist {'->'}</p>
                </div>
            ) }
        </div>
    )
}

export default PlaylistEntry
