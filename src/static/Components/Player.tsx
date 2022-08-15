import * as React from 'react'
import * as style from './styles/Player.module.less'
import { useMatch, useNavigate } from 'react-router-dom'
import cls from 'classnames'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { musicState, playingState } from '../model/playing'
import { useMemoizedFn } from 'ahooks'
import { TagEditer } from './TagEditer'
import { PLAY_MODE } from '../consts'
import { RESP_STATE } from '../../shareCommon/consts'
import { Music } from '../../types/Music'
import { deleteMusic } from '../API'
import { useProgress } from '../hooks/useProgress'
import { useDocTitle } from '../hooks/useDocTitle'
import { useShortcuts } from '../hooks/useShortcuts'
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
    const setPlaying = useSetRecoilState(playingState)
    const { curIndex, list } = useRecoilValue(playingState)

    useDocTitle(music ? `${music?.title} - ${music?.artist}` : 'Stop play - Music Server')
    const match = useMatch('playing')
    const naviTo = useNavigate()
    
    const [isPlaying, setIsPlaying] = useState(false)
    const [ time, setTime ] = useState(0)
    const [ volume, setVolume ] = useState(1)
    const curDuration = useRef(0)
    const naviToFullplayer = () => naviTo('/playing')
    const handleSwitchPlaying = useCallback((type) => () => {
        let nextIndex: number = -1
        if (curIndex) {
            if (type === PLAY_MODE.prev) {
                nextIndex = curIndex - 1 || 0
            }
            if (type === PLAY_MODE.next) {
                nextIndex = curIndex + 1 || 0
            }
        }
        if (type === PLAY_MODE.random) {
            nextIndex = Math.floor(Math.random() * list.length)
        }
        // if (type === PLAY_MODE.next && nextIndex >= list.length) {
        //     setCurPage(curPage + 1)
        // }
        if (nextIndex >= 0 && nextIndex < list.length) {
            setPlaying(_ => ({
                ..._,
                curIndex: nextIndex,
            }))
        }
    }, [curIndex, list])
    const handlePlayPrev = handleSwitchPlaying(PLAY_MODE.prev)
    const handlePlayNext = handleSwitchPlaying(PLAY_MODE.next)
    const handlePlayEnd = handlePlayNext
    const handlePlayError = useMemoizedFn(async () => {
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
    })
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

    const { album, artist, title } = music || {};
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
        return () => {
        }
    }, [audioRef])

    const handlePlayTimeupdate = useMemoizedFn((e) => {
        const { duration, currentTime } = audioRef.current || {}
        if (duration && currentTime) {
            curDuration.current = duration
            setTime(currentTime)
        }
    })
    useEffect(() => {
        const handlePlayStatusChange = () => {
            setIsPlaying(!audioRef.current?.paused)
        }
        audioRef.current?.addEventListener('pause', handlePlayStatusChange)
        audioRef.current?.addEventListener('play', handlePlayStatusChange)
        audioRef.current?.addEventListener('timeupdate', handlePlayTimeupdate)
        audioRef.current?.addEventListener('error', handlePlayError)

        return () => {
            audioRef.current?.removeEventListener('pause', handlePlayStatusChange)
            audioRef.current?.removeEventListener('play', handlePlayStatusChange)
            audioRef.current?.addEventListener('timeupdate', handlePlayTimeupdate)
            audioRef.current?.removeEventListener('error', handlePlayError)
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
        setVolume(progress / 100)
        if (audioRef.current) {
            audioRef.current.volume = progress / 100
        }
    }
    useProgress({el: volumeRef.current, onProgressSet: handleVolumeSet })

    useShortcuts({
        'space': {
            handler: ({ctrl}) => {
                if (match || ctrl) {
                    music ? isPlaying ? handlePause() : handlePlay() : null
                }
            }
        },
        'arrowdown': {
            handler: () => {
                const nextVolume = volume * 100 - 10
                if (match && nextVolume > 0) {
                    handleVolumeSet(nextVolume)
                }
            }
        },
        'arrowup': {
            handler: () => {
                const nextVolume = volume * 100 + 10
                if (match && nextVolume <= 100) {
                    handleVolumeSet(nextVolume)
                }
            }
        },
    })

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
    const desc = useMemo(() => {
        if (!music) {
            return ''
        }
        const { album, artist } = music
        if (album) {
            return `${artist} - ${album}`
        }
        return artist
    } , [music])
    const displayTimes = useMemo(() => {
        const formatTime = (time: number) => {
            const minute = Math.floor(time / 60)
            const second = Math.floor(time % 60)
            return `${minute}:${second < 10 ? '0' + second : second}`
        }
        if (!music) {
            return {
                duration: '00:00',
                time: '00:00'
            }
        }
        return {
            duration: formatTime(curDuration.current),
            time: formatTime(time)
        }
    }, [time, curDuration.current])

    return (
        <Fragment>
            <audio controls src={info.src} ref={audioRef} className={style.audioRef} />
            { match ? (
                <div className={style.fullContainer}>
                    <div className={style.coverContainer}>
                        <Cover src={info.cover} className={cls(style.fullCover, music ? style.playing : '')} />
                        {music ? <Cover src={info.cover} className={style.fullCoverBlur} /> : null}
                    </div>
                    <div className={style.fullContent}>
                        { music ? (
                            <Fragment>
                                <p className={style.fullTitle} title={music.title}>{music.title}</p>
                                <p className={style.fullDesc} title={desc}>{desc}</p>
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
                    <div className={style.timeContainer}>
                        { music ? (
                            <Fragment>
                                <p>{displayTimes.time}</p>
                                <p>{displayTimes.duration}</p>
                            </Fragment>
                        ) : null }
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
                        <img src={require('../imgs/ic-audio-high.svg')} className={style.icVolume} />
                        <div className={style.volumeProgress} style={{width: `${volume * 100}%`}} />
                        <div className={style.volumeDot} style={{left: `${volume * 100}%`}} />
                    </div>
                </div>
            ) : (
                <div className={style.miniContainer}>
                    <Cover src={info.cover} className={style.cover} onClick={naviToFullplayer} />
                    <p className={style.infoText} title={info.title} onClick={naviToFullplayer}>{info.title}</p>
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
                    <div className={style.progressContainer}>
                        <div className={style.progress} style={{width: `${progressPercent}%`}} />
                    </div>
                </div>
            ) }
        </Fragment>
    )
}
