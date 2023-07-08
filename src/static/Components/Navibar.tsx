import * as React from 'react'
import * as style from './styles/Navibar.module.less'
import { useNavigate } from 'react-router-dom'
import cls from 'classnames'
import { Svg } from './Svg'

const Navibar = (props) => {
  const { title, rightNode, className } = props
  const naviTo = useNavigate()
  const {
    onBack = () => { naviTo(-1) }
  } = props
  return (
    <div className={cls(style.navibar, className)}>
      <div className={style.backBtn} onClick={onBack}>
        <Svg src={require('../imgs/arrow-down.svg')} className={style.icBack} />
        <p>Back</p>
      </div>
      {title ? <div className={style.title}>{title}</div> : null}
      <div className={style.rightNode}>{rightNode}</div>
    </div>
  )
}

export default Navibar