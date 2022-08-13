import * as React from 'react'
import * as style from './styles/Player.module.less'
import { useMatch } from 'react-router-dom'
import cls from 'classnames'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { libraryState } from '../model/library'
import { musicState, playListState} from '../model/music'
import { TagEditer } from './TagEditer'
import { PLAY_MODE } from '../consts'
import { RESP_STATE } from '../../shareCommon/consts'
import { Music } from '../../types/Music'
import { deleteMusic } from '../API'
import useProgress from '../hooks/useProgress'
import { useDocTitle } from '../hooks/useDocTitle'
import Cover from './Cover'

const { Fragment, useRef, useEffect, useState, useMemo, useCallback } = React
const { origin } = window.location

interface IPlayer {
    onPlayEnd?: (PLAY_MODE) => () => void;
    onPlayError?: (m: Music) => void;
    onPrevSong?: () => void;
    onNextSong?: () => void;
}
export const Player = (props: IPlayer) => {
    const { music } = useRecoilValue(musicState)
    const setMusic = useSetRecoilState(musicState)
    const { curIndex, list: playList } = useRecoilValue(playListState)

    useDocTitle(music ? `${music?.title} - ${music?.artist}` : 'Stop play - Music Server')
    const match = useMatch('playing')
    const list = useRecoilValue(libraryState)
    
    const { onPlayEnd, onPlayError, onPrevSong, onNextSong } = props;
    const [isPlaying, setIsPlaying] = useState(false)
    const [ time, setTime ] = useState(0)
    const curDuration = useRef(0)
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
    const checkHasMusic = (afterFunc) => {
        if (music) {
            afterFunc()
        }
    }
    const handlePause = () => {
        setIsPlaying(false)
        checkHasMusic(() => {
            audioRef.current?.pause()
        })
    }
    const handlePlay = () => {
        setIsPlaying(true)
        checkHasMusic(() => {
            audioRef.current?.play()
        })
    }

    const { id, album, artist, title } = music || {};
    const [ isEditing, setEditing ] = useState(false)
    const [ playMode, setPlayMode ] = useState<PLAY_MODE>(PLAY_MODE.next)

    const audioRef = useRef<HTMLAudioElement>()
    useEffect(() => {
        if (music) {
            audioRef.current?.play()
            setEditing(false)
        }
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
    useEffect(() => {
        const handlePlayStatusChange = () => {
            setIsPlaying(!audioRef.current?.paused)
        }
        audioRef.current?.addEventListener('pause', handlePlayStatusChange)
        audioRef.current?.addEventListener('play', handlePlayStatusChange)
        audioRef.current?.addEventListener('timeupdate', handlePlayTimeupdate)
        return () => {
            audioRef.current?.removeEventListener('pause', handlePlayStatusChange)
            audioRef.current?.removeEventListener('play', handlePlayStatusChange)
            audioRef.current?.addEventListener('timeupdate', handlePlayTimeupdate)
        }
    }, [audioRef])
    
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

    const handlePlayTimeupdate = (e) => {
        const { duration, currentTime } = audioRef.current || {}
        if (duration && currentTime) {
            curDuration.current = duration
            setTime(currentTime)
        }
    }

    const fullProgressRef = useRef<HTMLElement>()
    const handleProgressSet = useCallback((progress: number) => {
        if (audioRef.current && audioRef.current.currentTime) {
            audioRef.current.currentTime = progress / 100 * curDuration.current
        }
    }, [])
    const handleProgressMove = (p) => {
        // TODO: change ui first, change audio progress at last call
        // handleProgressSet(p)
    }
    useProgress({el: fullProgressRef.current, onProgressSet: handleProgressSet, onMove: handleProgressMove})
    const progressPercent = Number((time / curDuration.current * 100).toFixed(2))

    const volumeRef = useRef()
    const handleVolumeSet = (progress: number) => {
        console.log(progress)
        if (audioRef.current) {
            audioRef.current.volume = progress / 100
        }
    }
    // useProgress({el: volumeRef.current, onProgressSet: handleVolumeSet })
    // const volumePercent = Number((audioRef.current?.volume * 100).toFixed(2))

    const playModeText = useMemo(() => {
        const transTable = {
            [PLAY_MODE.next]: 'In order',
            [PLAY_MODE.random]: 'Random'
        }
        return `Mode: ${transTable[playMode]}`
    }, [playMode])

    const info = useMemo(() => {
        if (!music) {
            return {
                title: 'No Playing',
                src: '',
                cover: ''
            }
        }
        return {
            title: `${music.title} - ${music.artist}`,
            src: `${origin}/file/music/${music.id}`,
            cover: `${origin}/file/album_cover/${music.albumId}`,
        }
    }, [music])

    return (
        <Fragment>
            <audio controls src={info.src} ref={audioRef} className={style.audioRef} />
            { match ? (
                <div className={style.fullContainer}>
                    <Cover src={info.cover} className={style.fullCover} />
                    <div className={style.fullContent}>
                        { music ? (
                            <Fragment>
                                <p className={style.fullTitle}>{music.title}</p>
                                <p className={style.fullArtist}>{music.artist}</p>
                            </Fragment>
                        ) : <p>{info.title}</p> }
                    </div>
                    <div
                        className={style.progressContainer}
                        ref={fullProgressRef}
                    >
                        <div className={style.progress} style={{width: `${progressPercent}%`}} />
                        <div className={style.progressDot} style={{left: `${progressPercent}%`}} />
                    </div>
                    <button onClick={switchPlayMode}>{playModeText}</button>
                    <div className={style.controlBtns}>
                        <img src={require('../imgs/ic-next.svg')} className={style.btnPrev} onClick={handlePlayPrev} />
                        {
                            isPlaying ? (
                                <img src={require('../imgs/ic-pause.svg')} className={style.btnPause} onClick={handlePause} />
                            ) : (
                                <img src={require('../imgs/ic-play.svg')} className={style.btnPlay} onClick={handlePlay} />
                            )
                        }
                        <img src={require('../imgs/ic-next.svg')} className={style.btnNext} onClick={handlePlayNext} />
                    </div>
                    <button onClick={handleEditToggle}>{isEditing ? 'close' : 'edit'}</button>
                    { isEditing ? (
                        <TagEditer id={music?.id} {...{album, artist, title}} onFinish={handleUpdated} />
                    ) : null}

                    <div 
                        className={style.volumeContainer}
                        ref={volumeRef}
                    >
                        <div className={style.volumeProgress} />
                        <div className={style.volumeDot} />
                    </div>
                </div>
            ) : (
                <div className={style.miniContainer}>
                    <div className={style.progressContainer}>
                        <div className={style.progress} style={{width: `${progressPercent}%`}} />
                    </div>
                    <Cover src={info.cover} className={style.cover} />
                    <p className={style.infoText} title={info.title}>{info.title}</p>
                    <div className={style.oprations}>
                        <img
                            onClick={isPlaying ? handlePause : handlePlay}
                            src={isPlaying ? require('../imgs/ic-pause.svg') : require('../imgs/ic-play.svg') } 
                            className={cls(
                                style.icOperation,
                                isPlaying ? style.icPause : ''
                            )}
                        />
                        <img
                            onClick={handlePlayNext}
                            src={require('../imgs/ic-next.svg')}
                            className={cls(
                                style.icOperation,
                                style.icNext
                            )}
                        />
                    </div>
                </div>
            ) }
        </Fragment>
    )
}
