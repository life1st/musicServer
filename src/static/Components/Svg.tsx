import React, { MouseEventHandler } from 'react'
import { ReactSVG } from 'react-svg'
import cls from 'classnames'
import * as style from './styles/Svg.module.less'

interface Props {
  src: string;
  className?: string;
  defaultColor?: boolean;
  onClick?: MouseEventHandler;
}
const noopFn = () => {}
export const Svg = (props: Props) => {
  const { src, className = '', defaultColor = true } = props
  const {
    onClick = noopFn
  } = props
  return (
    <ReactSVG onClick={onClick} className={cls(className, style.svgContainer, defaultColor && style.defaultColor)} src={src} />
  )
}
