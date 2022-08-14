import { useState, useEffect, useRef } from 'react'
import { useThrottleFn } from 'ahooks'

interface Params {
    el: HTMLElement | undefined,
    onProgressSet: (progress: number) => void;
    onMove?: (progress: number) => void;
}
export const useProgress = (params: Params) => {
    const { el, onProgressSet = () => {}, onMove = () => {} } = params || {}
    const [isKeyDown, setIsKeyDown] = useState(false)

    const elRef = useRef({})
    useEffect(() => {
        if (!el) {
            return
        }
        elRef.current = {
            left: el.offsetLeft,
            width: el.offsetWidth,
        }
        el?.addEventListener('mousedown', mouseDown)
        el?.addEventListener('mouseup', mouseUp)
        return () => {
            el.removeEventListener('mousedown', mouseDown)
            el.removeEventListener('mouseup', mouseUp)
            document.body.removeEventListener('mousemove', mouseMove)
        }
    }, [el])
    const mouseDown = (e) => {
        setIsKeyDown(true)
        document.body.addEventListener('mousemove', mouseMove)
    }
    const { run: mouseMove, cancel: cancelMove } = useThrottleFn((e) => {
        if (isKeyDown) {
            const { clientX } = e
            const moveX = clientX - elRef.current.left
            const percent = Number((moveX / elRef.current.width * 100).toFixed(2))
            onMove(percent)
        }
    }, { wait: 16 })
    const mouseUp = (e) => {
        setIsKeyDown(false)
        document.body.removeEventListener('mousemove', mouseMove)
        cancelMove()
        const { clientX } = e
        const moveX = Number(clientX - elRef.current.left)
        const percent = Number((moveX / elRef.current.width * 100).toFixed(2))
        onProgressSet(percent)
    }
}