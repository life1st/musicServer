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
    const handleProgressDown = (e) => {
        setIsKeyDonw(true)
    }
    const { run: handleProgressMove, cancel: cancelMove } = useThrottleFn((e) => {
        if (isKeyDonw) {
            const { clientX } = e
            onMove(Number((clientX / progressLong * 100).toFixed(2)))
        }
    }, { wait: 16 })
    const handleProgressUp = (e) => {
        setIsKeyDonw(false)
        cancelMove()
        const { clientX } = e
        onProgressSet(Number((clientX / progressLong * 100).toFixed(2)))
    }

    return {
        handleProgressDown,
        handleProgressMove,
        handleProgressUp,
    }
}

export default useProgress