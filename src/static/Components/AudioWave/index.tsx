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
  fillColor?: string;
}
interface IAudioWave {
  start: () => void
  stop: () => void
}

const AudioWave = forwardRef((props: Props, ref) => {
  const { audioRef, className = '', fillColor } = props
  const convasRef = useRef<HTMLCanvasElement>(null)
  const audioWaveRef = useRef<AudioWaveConstractor>()
  useImperativeHandle(ref, () => ({
    start: () => audioWaveRef.current.start(),
    stop: () => audioWaveRef.current.stop(),
  }))
  useEffect(() => {
    if (audioRef.current && convasRef.current && !audioWaveRef.current) {
      audioWaveRef.current = new AudioWaveConstractor(convasRef.current, audioRef.current)
      if (fillColor) {
        audioWaveRef.current.setConf({ fillColor })
      }
    }
    return () => {
      audioWaveRef.current?.stop()
    }
  }, [audioRef, convasRef])
  useEffect(() => {
    if (fillColor && audioWaveRef.current) {
      audioWaveRef.current.setConf({ fillColor })
    }
  }, [fillColor])
  return (
    <div className={className}>
      <canvas ref={convasRef} style={{height: '100%', width: '100%'}} />
    </div>
  )
})

export {
  AudioWave, IAudioWave
}
