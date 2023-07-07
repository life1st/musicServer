import * as React from 'react'
import * as style from './Toast.module.less'
import { createConfirmation } from 'react-confirm'

const { useEffect } = React
const Toast = (props: {
  text: string;
  dispose: () => void;
  resolve: () => void;
}) => {
  const { text, resolve } = props
  useEffect(() => {
    resolve()
  }, [])
  return (
    <div className={style.toast}>{text}</div>
  )
}

export const toast = (config: {
  unmountDelay?: number;
  text?: string;
}) => {
  const {
    unmountDelay = 3000,
    text = '',
  } = config
  return createConfirmation(Toast, unmountDelay)({text, unmountDelay})
}