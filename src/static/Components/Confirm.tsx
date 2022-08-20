import * as React from 'react'
import * as style from './styles/Confirm.module.less'
import { createConfirmation } from 'react-confirm'

interface Option {
  text: string;
  action: () => void;
}

const Confirm = ({
  title, options,
  resolve, dispose, reject,
  ...props
}: {
  title: string;
  options: Option[];
  resolve: typeof Promise.resolve;
  reject: typeof Promise.reject;
  dispose: () => void;
}) => {
  const close = (result) => {
    resolve(result)
    dispose()
  }
  return (
    <div className={style.mask} onClick={() => close(true)}>
      <div className={style.confirm}>
        { title ? <p className={style.title}>{title}</p> : null }
        <ul>
          { options.map(op => (
              <li className={style.option} key={op.text} onClick={() => {
                op.action?.()
                close(true)
              }}>{op.text}</li>
          )) }
        </ul>
      </div>
      
    </div>
  )
}

export const confirm = (config: {
  unmountDelay?: number;
  title?: string;
  options: Option[];
}) => {
  const { 
    unmountDelay = 100,
    title = '',
    options = [],
    ...restConfig
  } = config || {}
  return createConfirmation(Confirm, {
    unmountDelay
  })({title, options})
}
