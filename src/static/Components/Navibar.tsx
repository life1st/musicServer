import * as React from 'react'
import * as style from './styles/Navibar.module.less'

const Navibar = (props) => {
  const { onBack = () => {} } = props
  return (
    <div>
      <div className={style.backBtn} onClick={onBack}>
        <img src={require('../imgs/arrow-down.svg')} className={style.icBack} />
        <p>Back</p>
      </div>
    </div>
  )
}

export default Navibar