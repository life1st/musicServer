import * as React from 'react'
import cls from 'classnames'
import styl from './styles/Cover.module.less'

const { useEffect, useState, Fragment } = React
interface Props {
  src: string;
  defaultSrc?: string;
  className?: string;
  style?: React.CSSProperties;
  disablePreview?: boolean;
  onClick?: () => void;
}
const icCoverDefault = require('../imgs/ic-album-default.svg')

const Cover = (props: Props) => {
  const { src, defaultSrc = icCoverDefault, className = '', style, disablePreview = true } = props
  const { onClick } = props
  const [ showPreview, setPreviewState ] = useState(false)
  const [ url, setUrl ] = useState('')
  const handleClick = () => {
    if (onClick) {
      if (!disablePreview) {
        console.log('has onClick prop, so big cover preview not working.')
      }
      onClick()
    } else {
      setPreviewState(!showPreview)
    }
  }
  const handleClickPreview = () => {
    if (showPreview) {
      setPreviewState(false)
    }
  }
  const handleLoadError = () => {
    setUrl(defaultSrc)
  }
  useEffect(() => {
    if (src.includes('undefined')) {
      setUrl(defaultSrc)
    } else {
      setUrl(src)
    }
  }, [src])

  return (
    <Fragment>
      <div className={cls({
        [styl.coverPreviewBox]: true,
        [styl.coverPreviewBoxShow]: showPreview,
        [styl.coverPreviewBoxHide]: !showPreview
      })} onClick={handleClickPreview}>
        <img
          onError={handleLoadError}
          className={cls({
            [styl.coverPreview]: true,
            [styl.coverPreviewShow]: showPreview,
            [styl.coverPreviewHide]: !showPreview,
          })}
          src={url || defaultSrc}
          style={style}
        />
      </div>
      <img
        onClick={handleClick}
        onError={handleLoadError}
        className={cls({
          [className]: true,
          [styl.normalCover]: true,
          [styl.hideCover]: showPreview,
        })}
        src={url || defaultSrc}
        style={style}
      />
    </Fragment>
  )
}

export default Cover
