import * as React from 'react'
import cls from 'classnames'
import * as styl from './styles/Cover.module.less'
import { Svg } from './Svg'

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
  const { src, defaultSrc = icCoverDefault, className = '', style, disablePreview = false } = props
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
    if (!src || src.includes('undefined')) {
      setUrl(defaultSrc)
    } else {
      setUrl(src)
    }
  }, [src])

  return (
    <Fragment>
      {
        disablePreview ? null : (
          <div className={cls({
            [styl.coverPreviewBox]: true,
            [styl.coverPreviewBoxShow]: showPreview,
            [styl.coverPreviewBoxHide]: !showPreview
          })} onClick={handleClickPreview}>
            {url ? (
              <img
                onError={handleLoadError}
                className={cls({
                  [styl.coverPreview]: true,
                  [styl.coverPreviewShow]: showPreview,
                  [styl.coverPreviewHide]: !showPreview,
                })}
                src={url}
                style={style}
              />
            ) : (
              <Svg 
                src={defaultSrc}
                className={cls({
                  [styl.coverPreview]: true,
                  [styl.coverPreviewShow]: showPreview,
                  [styl.coverPreviewHide]: !showPreview,
                })}
              />
            )}
          </div>
        )
      }
      { url ? (
        <img
          onClick={handleClick}
          onError={handleLoadError}
          className={cls({
            [className]: true,
            [styl.normalCover]: true,
            [styl.hideCover]: showPreview,
          })}
          src={url}
          style={style}
        />
      ) : (
        <Svg
          src={defaultSrc}
          className={cls({
            [className]: true,
            [styl.normalCover]: true,
            [styl.hideCover]: showPreview,
          })}
        />
      )}
    </Fragment>
  )
}

export default Cover
