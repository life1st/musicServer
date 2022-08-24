import * as React from 'react'
import * as style from './styles/PlaylistDetail.module.less'
import dayJs from 'dayjs'
import { useParams, useNavigate } from 'react-router-dom'
import { getPlaylist, deletePlaylist } from '../API/playlistApi'
import { Playlist as IPlaylist } from '../../types/Playlist'
import { EndFix } from '../Components/Scroller'
import Songlist from '../Components/Songlist'
import Navibar  from '../Components/Navibar'
import Cover from '../Components/Cover'
const { useEffect, useState } = React

const Playlist = (props) => {
    const { id } = useParams()
    const [ playlist, setPlaylist ] = useState<IPlaylist | null>(null)
    const naviTo = useNavigate()
    const fetchData = async () => {
        const { status, data } = await getPlaylist(id)
        console.log(data)
        if (status === 200) {
            setPlaylist(data)
        }
    }
    const handleItemClick = (music, i) => {

    }
    const handleDel = async () => {
        const { status, data } = await deletePlaylist(playlist?.id)
        if (status === 200 && data.isDelete) {
            const res = alert('delete success')
            console.log(res)
            naviTo(-1)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])
    
    
    return (
        <div>
            <Navibar />
            { playlist ? (
                <Songlist
                    startNode={(
                        <div className={style.infoContainer}>
                            <Cover src={`/file/cover/${playlist.coverId}`} className={style.cover} />
                            <div className={style.content}>
                                <div className={style.title}>{playlist.title}</div>
                                <div className={style.time}>{dayJs(playlist.updateTime).fromNow()}</div>
                                <div className={style.oprations}>
                                    <img
                                        src={require('../imgs/ic-delete.svg')}
                                        className={style.delete}
                                        onClick={handleDel}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                    list={playlist.songs || []}
                    onItemClick={(item, i) => { handleItemClick(item, i) }}
                />
            ) : (
                <EndFix showLoading={true} hasMore={true} />
            )}
        </div>
    )
}

export default Playlist
