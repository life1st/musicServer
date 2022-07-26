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
    onPrevSong: () => void;
    onNextSong: () => void;
}
export const Player = (props: IPlayer) => {
    const { music, onPlayEnd, onPrevSong, onNextSong } = props;
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

    const handleEditToggle = () => {
        setEditing(!isEditing)
    }
    const handleUpdated = (isSuccess) => {
        setEditing(false)
        console.log(isSuccess)
    }
    return (
        <div>
            <audio controls src={`/api/music/${id}`} ref={ref} />
            <p>{music.title} - {music.artist}</p>
            <div>
                <button onClick={onPrevSong}>Prev</button>
                <button onClick={onNextSong}>Next</button>
            </div>
            <button onClick={handleEditToggle}>{isEditing ? 'close' : 'edit'}</button>
            { isEditing ? (
                <TagEditer id={id} {...{album, artist, title}} onFinish={handleUpdated} />
            ) : null}
        </div>
    )
}
