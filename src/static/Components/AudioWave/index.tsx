import * as React from 'react'
import { AudioWave as AudioWaveConstractor } from './AudioWave'

const {
  useRef,
  useEffect,
  useImperativeHandle,
  forwardRef,
} = React

interface Props {
  audioRef: React.RefObject<HTMLAudioElement>;
  className?: string;
}
interface IAudioWave {
  start: () => void
  stop: () => void
}

const AudioWave = forwardRef((props: Props, ref) => {
  const { audioRef, className = '' } = props
  const convasRef = useRef<HTMLCanvasElement>(null)
  const audioWaveRef = useRef()
  useImperativeHandle(ref, () => ({
    start: () => audioWaveRef.current.start(),
    stop: () => audioWaveRef.current.stop(),
  }))
  useEffect(() => {
    if (audioRef && convasRef && !audioWaveRef.current) {
      audioWaveRef.current = new AudioWaveConstractor(convasRef.current, audioRef.current)
    }
    return () => {
      audioWaveRef.current?.stop()
    }
  }, [audioRef, convasRef])
  return (
    <div className={className}>
      <canvas ref={convasRef} style={{height: '100%', width: '100%'}} />
    </div>
  )
})

export {
  AudioWave, IAudioWave
}
