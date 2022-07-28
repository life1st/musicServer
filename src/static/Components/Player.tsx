import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react'
import { TagEditer } from './TagEditer'
import { PLAY_MODE } from '../consts'

interface IMusic {
    id: string;
    title: string;
    artist: string;
    album: string;
}
interface IPlayer {
    music: IMusic;
    onPlayEnd: (PLAY_MODE) => () => void;
    onPlayError?: (m: IMusic) => void;
    onPrevSong: () => void;
    onNextSong: () => void;
}
export const Player = (props: IPlayer) => {
    const { music, onPlayEnd, onPlayError, onPrevSong, onNextSong } = props;
    const { id, album, artist, title } = music || {};
    const [ isEditing, setEditing ] = useState(false)
    const [ playMode, setPlayMode ] = useState<PLAY_MODE>(PLAY_MODE.next)

    const audioRef = useRef()
    useEffect(() => {
        audioRef.current?.play()
        setEditing(false)
    }, [music, audioRef])
    useEffect(() => {
        audioRef.current?.addEventListener('ended', onPlayEnd(playMode))
        return () => {
            audioRef.current?.removeEventListener('ended', onPlayEnd(playMode))
        }
    }, [playMode, audioRef])
    useEffect(() => {
        audioRef.current?.addEventListener('error', onPlayError)
        return () => {
            audioRef.current?.removeEventListener('error', onPlayError)
        }
    }, [onPlayError, audioRef])

    const handleEditToggle = () => {
        setEditing(!isEditing)
    }
    const handleUpdated = (isSuccess) => {
        setEditing(false)
        console.log(isSuccess)
    }
    const switchPlayMode =() => {
        if (playMode === PLAY_MODE.next) {
            setPlayMode(PLAY_MODE.random)
        }
        if (playMode === PLAY_MODE.random) {
            setPlayMode(PLAY_MODE.next)
        }
    }

    const playModeText = useMemo(() => {
        const transTable = {
            [PLAY_MODE.next]: 'In order',
            [PLAY_MODE.random]: 'Random'
        }
        return `Mode: ${transTable[playMode]}`
    }, [playMode])

    return (
        <div>
            <audio controls src={`/api/music/${id}`} ref={audioRef} />
            <p>{music.title} - {music.artist}</p>
            <p>{music.album}</p>
            <div>
                <button onClick={onPrevSong}>Prev</button>
                <button onClick={onNextSong}>Next</button>
                <button onClick={switchPlayMode}>{playModeText}</button>
            </div>
            <button onClick={handleEditToggle}>{isEditing ? 'close' : 'edit'}</button>
            { isEditing ? (
                <TagEditer id={id} {...{album, artist, title}} onFinish={handleUpdated} />
            ) : null}
        </div>
    )
}
