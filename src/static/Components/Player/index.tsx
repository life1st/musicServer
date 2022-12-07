import * as React from 'react'
import * as style from './Player.module.less'
import { useMatch, useNavigate, useSearchParams } from 'react-router-dom'
import cls from 'classnames'
import { useMemoizedFn } from 'ahooks'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { CSSTransition } from 'react-transition-group'
import { ROUTES } from '../../consts'
import { musicState, playingState } from '../../model/playing'
import { PLAY_MODE } from '../../consts'
import { RESP_STATE } from '../../../shareCommon/consts'
import { Music } from '../../../types/Music'
import { deleteMusic } from '../../API'
import { useProgress } from '../../hooks/useProgress'
import { useShortcuts } from '../../hooks/useShortcuts'
import { Svg } from '../Svg'
import Cover from '../Cover'
import PlayerInfo from './PlayerInfo'
import { AudioWave, IAudioWave } from '../AudioWave'
import { getMusicMeta } from '../../API'

const { Fragment, useRef, useEffect, useState, useMemo, useCallback } = React
const { origin } = window.location

const icNext = require('../../imgs/ic-next.svg')
const icPause = require('../../imgs/ic-pause.svg')
const icPlay = require('../../imgs/ic-play.svg')
const icAudioHigh = require('../../imgs/ic-audio-high.svg')
const icCheckList = require('../../imgs/ic-checklist.svg')

interface IPlayer {
    onPlayEnd?: (PLAY_MODE) => () => void;
    onPlayError?: (m: Music) => void;
    onPrevSong?: () => void;
    onNextSong?: () => void;
}

const Player = (props: IPlayer) => {
    const [ searchParams, setSearchParams ] = useSearchParams()
    const matchPlaying = useMatch(ROUTES.PLAYING)
    const naviTo = useNavigate()

    const { music } = useRecoilValue(musicState)
    const { curIndex, list } = useRecoilValue(playingState)
    const setPlaying = useSetRecoilState(playingState)

    const [ isPlaying, setIsPlaying ] = useState(false)
    const [ time, setTime ] = useState(0)
    const [ volume, setVolume ] = useState(1)
    const curDuration = useRef(0)
    
    const naviToFullplayer = useMemoizedFn(() => {
        if (music) {
            naviTo(ROUTES.PLAYING)
        }
    })
    const naviBack = useMemoizedFn(() => naviTo(-1))
    const naviToList = useMemoizedFn(() => { naviTo(ROUTES.PLAYING_LIST) })

    const waveRef = useRef<IAudioWave>(null)
    const handleSwitchPlaying = useMemoizedFn((type) => () => {
        let nextIndex: number = -1
        if (curIndex !== null) {
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
    })
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
            setTimeout(() => {
                if (audioRef.current?.paused) {
                    waveRef.current?.stop()
                }
            }, 300);
        }) 
    }
    const handlePlay = () => {
        setIsPlaying(true)
        checkHasMusic(() => {
            audioRef.current?.play()
            waveRef.current?.start()
        })
    }

    const [ playMode, setPlayMode ] = useState<PLAY_MODE>(PLAY_MODE.next)

    useEffect(() => {
        if (matchPlaying) {
            const musicId = searchParams.get('id')
            if (!music && !musicId) {
                naviTo(ROUTES.LIBRARY)
            }
            if (music && !musicId) {
                setSearchParams({ id: music.id }, { replace: true })
            }
            if (!music && musicId) {
                getMusicMeta(musicId).then(({status, data}) => {
                    if (status === 200) {
                        setPlaying({
                            list: [data.music],
                            curIndex: 0
                        })
                    }
                })
            }
        }
    }, [matchPlaying])

    const audioRef = useRef<HTMLAudioElement>(null)
    useEffect(() => {
        if (music && audioRef.current) {
            audioRef.current.currentTime = 0
            setTimeout(handlePlay, 0)
        }
        audioRef.current?.addEventListener('ended', handlePlayEnd)
        return () => {
            audioRef.current?.removeEventListener('ended', handlePlayEnd)
        }
    }, [music, audioRef])

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
    
    const switchPlayMode =() => {
        if (playMode === PLAY_MODE.next) {
            setPlayMode(PLAY_MODE.random)
        }
        if (playMode === PLAY_MODE.random) {
            setPlayMode(PLAY_MODE.next)
        }
    }

    const fullProgressRef = useRef<HTMLDivElement>(null)
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

    const volumeRef = useRef<HTMLDivElement>(null)
    const handleVolumeSet = (progress: number) => {
        const percent = progress / 100
        if (percent < 0 || percent > 1) {
            return
        }
        setVolume(percent)
        if (audioRef.current) {
            audioRef.current.volume = progress / 100
        }
    }
    useProgress({el: volumeRef.current, onProgressSet: handleVolumeSet })

    useShortcuts({
        'space': {
            handler: ({ctrl}) => {
                if (matchPlaying || ctrl) {
                    music ? isPlaying ? handlePause() : handlePlay() : null
                }
            }
        },
        'arrowdown': {
            handler: () => {
                const nextVolume = volume * 100 - 10
                if (matchPlaying && nextVolume >= 0) {
                    handleVolumeSet(nextVolume)
                }
            }
        },
        'arrowup': {
            handler: () => {
                const nextVolume = volume * 100 + 10
                if (matchPlaying && nextVolume <= 100) {
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
                desc: '',
                src: '',
                cover: ''
            }
        }
        const { album, artist } = music
        let desc = artist
        if (album) {
            desc = `${artist} - ${album}`
        }
        return {
            title: `${music.title} - ${music.artist}`,
            desc,
            src: `${origin}/file/music/${music.id}`,
            cover: `${origin}/file/album_cover/${music.albumId}`,
        }
    }, [music])

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

    const fullPlayerRef = useRef<HTMLDivElement>(null)
    return (
        <Fragment>
            <audio controls src={info.src} ref={audioRef} className={style.audioRef} />
            <CSSTransition 
                in={Boolean(matchPlaying)}
                nodeRef={fullPlayerRef}
                timeout={350}
                classNames={'fullplayer-transition'}
            >
                <div className={cls(style.fullContainer, !matchPlaying ? style.hideFull : '')} ref={fullPlayerRef}>
                    <AudioWave
                        ref={waveRef}
                        audioRef={audioRef}
                        className={style.AudioWave}
                    />
                    <Svg src={require('../../imgs/arrow-down.svg')} className={style.icCloseFullPlayer} onClick={naviBack} />
                    <div className={style.coverContainer}>
                        <Cover src={info.cover} className={cls(style.fullCover, music ? style.playing : '')} />
                        {music ? <Cover src={info.cover} className={style.fullCoverBlur} /> : null}
                    </div>
                    <div className={style.fullContent}>
                        { music ? (
                            <Fragment>
                                <p className={style.fullTitle} title={music.title}>{music.title}</p>
                                <PlayerInfo {...music as Music} />
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
                        <Svg src={icNext} className={style.btnPrev} onClick={handlePlayPrev} />
                        {
                            isPlaying ? (
                                <Svg src={icPause} className={style.btnPause} onClick={handlePause} />
                            ) : (
                                <Svg src={icPlay} className={style.btnPlay} onClick={handlePlay} />
                            )
                        }
                        <Svg src={icNext} className={style.btnNext} onClick={handlePlayNext} />
                    </div>
                    <div className={style.endingContainer}>
                        <div 
                            className={style.volumeContainer}
                            ref={volumeRef}
                        >
                            <Svg src={icAudioHigh} className={style.icVolume} />
                            <div className={style.volumeProgress} style={{width: `${volume * 100}%`}} />
                            <div className={style.volumeDot} style={{left: `${volume * 100}%`}} />
                        </div>
                        <Svg src={icCheckList} className={style.icPlayinglist} onClick={naviToList} />
                    </div>
                </div>
            </CSSTransition>
            { matchPlaying ? null : (
                <div className={style.miniContainer}>
                    <Cover src={info.cover} className={style.cover} onClick={naviToFullplayer} />
                    <div className={style.infoText} title={info.title} onClick={naviToFullplayer}>
                        <p>{info.title}</p>
                    </div>
                    <div className={style.oprations}>
                        <Svg
                            onClick={isPlaying ? handlePause : handlePlay}
                            src={isPlaying ? icPause : icPlay } 
                            className={cls(
                                style.icOperation,
                                isPlaying ? style.icPause : ''
                            )}
                        />
                        <Svg
                            onClick={handlePlayNext}
                            src={icNext}
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

export default Player