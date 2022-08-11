import { useState } from 'react'
import { useThrottleFn } from 'ahooks'

interface Params {
    ref: any,
    onProgressSet: (progress: number) => void;
    onMove?: (progress: number) => {}
}
const useProgress = (params: Params) => {
    const { ref, onProgressSet = () => {}, onMove = () => {} } = params || {}
    const progressLong = ref.current?.clientWidth
    const [isKeyDonw, setIsKeyDonw] = useState(false)
    const mouseDown = (e) => {
        setIsKeyDonw(true)
    }
    const { run: mouseMove, cancel: cancelMove } = useThrottleFn((e) => {
        if (isKeyDonw) {
            const { clientX } = e
            onMove(Number((clientX / progressLong * 100).toFixed(2)))
        }
    }, { wait: 16 })
    const mouseUp = (e) => {
        setIsKeyDonw(false)
        cancelMove()
        const { clientX } = e
        onProgressSet(Number((clientX / progressLong * 100).toFixed(2)))
    }

    return {
        mouseDown,
        mouseMove,
        mouseUp,
    }
}

export default useProgress