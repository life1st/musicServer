import React, { useRef, useEffect, useState, useMemo, useCallback, ReactComponentElement } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { libraryState, pageState } from '../model/library'
import { musicState } from '../model/music'
import { TagEditer } from './TagEditer'
import { PLAY_MODE } from '../consts'
import { RESP_STATE } from '../../shareCommon/consts'
import { deleteMusic } from '../API'

interface IMusic {
    id: string;
    title: string;
    artist: string;
    album: string;
}
interface IPlayer {
    onPlayEnd?: (PLAY_MODE) => () => void;
    onPlayError?: (m: IMusic) => void;
    onPrevSong?: () => void;
    onNextSong?: () => void;
}
export const Player = (props: IPlayer) => {
    const { curIndex, music } = useRecoilValue(musicState)
    const setMusic = useSetRecoilState(musicState)

    const list = useRecoilValue(libraryState)
    
    const { onPlayEnd, onPlayError, onPrevSong, onNextSong } = props;
    const handleSwitchPlaying = useCallback((type) => () => {
        let nextIndex: number = -1
        if (type === PLAY_MODE.prev) {
            nextIndex = curIndex - 1 || 0
        }
        if (type === PLAY_MODE.next) {
            nextIndex = curIndex + 1 || 0
        }
        if (type === PLAY_MODE.random) {
            nextIndex = Math.floor(Math.random() * list.length)
        }
        // if (type === PLAY_MODE.next && nextIndex >= list.length) {
        //     setCurPage(curPage + 1)
        // }
        if (nextIndex >= 0 && nextIndex < list.length) {
            setMusic((_) => ({
            curIndex: nextIndex,
            music: list[nextIndex]
            }))
        }
    }, [curIndex, list])
    const handlePlayPrev = handleSwitchPlaying(PLAY_MODE.prev)
    const handlePlayNext = handleSwitchPlaying(PLAY_MODE.next)
    const handlePlayEnd = handlePlayNext
    const handlePlayError = async () => {
        if (!music) return
        const isSure = confirm(`play ${music.title + '-' + music.artist} error, delete it?`)
        if (isSure) {
            const {status, data} = await deleteMusic(music.id)
            if (status === 200) {
                if (data.status === RESP_STATE.success) {
                    console.log('delete success')
                }
                if (data.status === RESP_STATE.alreadyDone) {
                    console.log('already deleted')
                }
            }
        }
        handlePlayNext()
    }

    const { id, album, artist, title } = music || {};
    const [ isEditing, setEditing ] = useState(false)
    const [ playMode, setPlayMode ] = useState<PLAY_MODE>(PLAY_MODE.next)

    const audioRef = useRef<HTMLAudioElement>()
    useEffect(() => {
        audioRef.current?.play()
        setEditing(false)
    }, [music, audioRef])
    useEffect(() => {
        audioRef.current?.addEventListener('ended', handlePlayEnd)
        return () => {
            audioRef.current?.removeEventListener('ended', handlePlayEnd)
        }
    }, [playMode, audioRef])
    useEffect(() => {
        audioRef.current?.addEventListener('error', handlePlayError)
        return () => {
            audioRef.current?.removeEventListener('error', handlePlayError)
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

    if (!music) {
        return (
            <div>
                <p>No music</p>
            </div>
        )
    }

    return (
        <div>
            <audio controls src={`/api/music/${id}`} ref={audioRef} />
            <p>{music.title} - {music.artist}</p>
            <p>{music.album}</p>
            <div>
                <button onClick={handlePlayPrev}>Prev</button>
                <button onClick={handlePlayNext}>Next</button>
                <button onClick={switchPlayMode}>{playModeText}</button>
            </div>
            <button onClick={handleEditToggle}>{isEditing ? 'close' : 'edit'}</button>
            { isEditing ? (
                <TagEditer id={id} {...{album, artist, title}} onFinish={handleUpdated} />
            ) : null}
        </div>
    )
}
