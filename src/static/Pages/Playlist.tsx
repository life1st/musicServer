import * as React from 'react'
import { useParams } from 'react-router-dom'
import { getPlaylist } from '../API/playlistApi'
import { Playlist as IPlaylist } from '../../types/Playlist'
import { EndFix } from '../Components/Scroller'
import Songlist from '../Components/Songlist'
import Navibar  from '../Components/Navibar'
const { useEffect, useState } = React

const Playlist = (props) => {
    const { id } = useParams()
    const [ playlist, setPlaylist ] = useState<IPlaylist | null>(null)
    const fetchData = async () => {
        const { status, data } = await getPlaylist(id)
        console.log(data)
        if (status === 200) {
            setPlaylist(data)
        }
    }
    const handleItemClick = (music, i) => {

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
                        <div>
                            <div className="title">{playlist.title}</div>
                            <div className="time">{playlist.updateTime}</div>
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
