import React, { MouseEventHandler } from 'react'
import { ReactSVG } from 'react-svg'
import cls from 'classnames'
import * as style from './styles/Svg.module.less'

interface Props {
  src: string;
  className?: string;
  onClick?: MouseEventHandler;
}
export const Svg = (props: Props) => {
  const { src, className = '' } = props
  const {
    onClick = () => {}
  } = props
  return (
    <ReactSVG onClick={onClick} className={cls(className, style.svgContainer)} src={src} />
  )
}
