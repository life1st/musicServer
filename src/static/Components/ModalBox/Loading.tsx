import * as React from 'react'
import * as style from './Loading.module.less'
import clx from 'classnames'
import { createConfirmation } from 'react-confirm'
import { Svg } from '../Svg'

const { useEffect } = React
const Loading = (props) => {
  const { isFullPage = true, dispose, emitFinish, text } = props
  useEffect(() => {
    emitFinish(dispose)
  }, [])
  return (
    <div className={clx(isFullPage && style.fullContainer)}>
      <div className={style.loadingWrapper}>
        <Svg src={require('../../imgs/ic-loading.svg')} className={style.icLoading} defaultColor={false} />
        <p className={style.loadingText}>{text}</p>
      </div>
    </div>
  )
}

export const loading = (config: {
  unmountDelay?: number;
  isFullPage?: boolean;
  text?: string;
}) => {
  const {
    isFullPage = true,
    text = 'loading...',
  } = config || {}
  let finishFn = () => {}
  createConfirmation(Loading, 1)({ text, isFullPage, emitFinish: (_finishFn) => {finishFn = _finishFn} })
  return () => {
    finishFn?.()
  }
}
