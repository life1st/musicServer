import { useState, useEffect, useRef } from 'react'
import { useThrottleFn } from 'ahooks'

interface Params {
    el: HTMLDivElement | null
    onProgressSet: (progress: number) => void
    onMove?: (progress: number) => void
    onPressStatusChange?: (isPressing: boolean) => void
}
export const useProgress = (params: Params) => {
    const { el, onProgressSet = () => {}, onMove = () => {}, onPressStatusChange = () => {} } = params || {}
    const isKeyDown = useRef(false)

    const elRef = useRef({})
    useEffect(() => {
        if (!el) {
            return
        }
        const elPos = el.getBoundingClientRect()
        elRef.current = {
            left: elPos.left,
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
        isKeyDown.current = true
        onPressStatusChange(true)
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
        if (!isKeyDown) {
            return
        }
        isKeyDown.current = false
        onPressStatusChange(false)
        document.body.removeEventListener('mousemove', mouseMove)
        cancelMove()
        const { clientX } = e
        const moveX = Number(clientX - elRef.current.left)
        const percent = Number((moveX / elRef.current.width * 100).toFixed(2))
        onProgressSet(percent)
    }
}