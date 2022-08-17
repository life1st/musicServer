import * as React from 'react'
import { createPlaylist, getPlaylists } from '../API/playlistApi'
import { Playlist as IPlaylist } from '../../types/Playlist'

const { useEffect, useState } = React

const Playlists = (props) => {
    const [list, setList] = useState<IPlaylist[]>([])

    const fetchData = async (page = 0) => {
        const { status, data } = await getPlaylists(page)
        if (status === 200) {
            setList(data)
        }
    }
    useEffect(() => {
        fetchData()
    }, [])

    const handleCreate = async () => {
        const name = prompt('input playlist name')
        if (name) {
            const result = createPlaylist({
                title: name,
            })
            console.log(result)
        }
    }

    return (
        <div>
            <button onClick={handleCreate}>create</button>
            { list.map(item => (
                <div key={item.id}>
                    {item.title}
                    <p>{item.updateTime}</p>
                </div>
            ))}
        </div>
    )
}

export default Playlists