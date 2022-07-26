import React, { useRef, useEffect, useState } from 'react'
import { TagEditer } from './TagEditer'

interface IMusic {
    id: string;
    title: string;
    artist: string;
    album: string;
}
interface IPlayer {
    music: IMusic;
    onPlayEnd: () => void;
}
export const Player = (props: IPlayer) => {
    const { music, onPlayEnd } = props;
    const { id, album, artist, title } = music || {};
    const [ isEditing, setEditing ] = useState(false)
    const ref = useRef()
    useEffect(() => {
        ref.current?.play()
        setEditing(false)
    }, [music])
    useEffect(() => {
        ref.current?.addEventListener('ended', onPlayEnd)
        return () => {
            ref.current?.removeEventListener('ended', onPlayEnd)
        }
    }, [])

    const handleEdit = () => {
        setEditing(true)
    }
    const handleUpdated = (isSuccess) => {
        setEditing(false)
        console.log(isSuccess)
    }
    return (
        <div>
            <audio controls src={`/api/music/${id}`} ref={ref} />
            <p>{music.title}</p>
            <p>{music.artist}</p>
            <button onClick={handleEdit}>Edit</button>
            { isEditing ? (
                <TagEditer id={id} {...{album, artist, title}} onFinish={handleUpdated} />
            ) : null}
        </div>
    )
}
