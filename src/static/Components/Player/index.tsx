import React, { useRef, useEffect } from 'react'

interface IMusic {
    id: string;
    title: string;
    artist: string;
}
interface IPlayer {
    music: IMusic;
    onPlayEnd: () => void;
}
export const Player = (props: IPlayer) => {
    const { music, onPlayEnd } = props;
    const ref = useRef()
    useEffect(() => {
        setTimeout(() => {
            ref.current?.play()
        })
    }, [music])
    useEffect(() => {
        ref.current?.addEventListener('ended', onPlayEnd)
        return () => {
            ref.current?.removeEventListener('ended', onPlayEnd)
        }
    }, [])
    return (
        <div>
            <audio controls src={`/api/music/${music.id}`} ref={ref} />
            <p>{music.title}</p>
            <p>{music.artist}</p>
        </div>
    )
}
