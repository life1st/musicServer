import React, { useRef, useEffect } from 'react'

interface IPlayer {
    src: string;
    onPlayEnd: () => void;
}
export const Player = (props: IPlayer) => {
    const { src, onPlayEnd } = props;
    const ref = useRef()
    useEffect(() => {
        setTimeout(() => {
            ref.current && ref.current.play()
        })
    }, [src])
    useEffect(() => {
        if (ref.current) {
            ref.current.addEventListener('ended', onPlayEnd)
        }
        return () => {
            if (ref.current) {
                ref.current.removeEventListener('ended', onPlayEnd)
            }
        }
    }, [])
    return (
        <audio controls src={src} ref={ref} />
    )
}
