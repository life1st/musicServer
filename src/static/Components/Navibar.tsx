import * as React from 'react'
import * as style from './styles/Navibar.module.less'
import { useNavigate } from 'react-router-dom'

const Navibar = (props) => {
  let { onBack, title } = props
  const naviTo = useNavigate()
  if (!onBack) {
    onBack = () => {
      naviTo(-1)
    }
  }
  return (
    <div className={style.navibar}>
      <div className={style.backBtn} onClick={onBack}>
        <img src={require('../imgs/arrow-down.svg')} className={style.icBack} />
        <p>Back</p>
      </div>
      {title ? <div className={style.title}>{title}</div> : null}
      <div className={style.rightNode}></div>
    </div>
  )
}

export default Navibar