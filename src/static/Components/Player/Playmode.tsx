import * as React from 'react'
import * as style from './player.module.less'
import cls from 'classnames'
import { Svg } from '../Svg'
import { useMemoizedFn } from 'ahooks'


export enum PLAY_MODE {
  inOrder,
  singleLoop,
  random,
}

interface Props {
  mode: PLAY_MODE
  onChange: (mode: PLAY_MODE) => void
  className?: string
}
const modeList = [PLAY_MODE.inOrder, PLAY_MODE.random, PLAY_MODE.singleLoop]
const Playmode = (props: Props) => {
  const { mode = PLAY_MODE.inOrder, onChange = () => {}, className = '' } = props
  const icMap = {
    [PLAY_MODE.inOrder]: require('../../imgs/ic-order.svg'),
    [PLAY_MODE.singleLoop]: require('../../imgs/ic-singleloop.svg'),
    [PLAY_MODE.random]: require('../../imgs/ic-random.svg'),
  }
  const handleChange = useMemoizedFn(() => {
    const i = (modeList.findIndex(m => m === mode) + 1) % modeList.length
    onChange(modeList[i])
  })

  return (
    <div className={cls(style.playmode, className)}>
      <Svg src={icMap[mode]} onClick={handleChange} className={cls(style.icPlaymode, style['ic' + mode])} />
    </div>
  )
}

export { Playmode }