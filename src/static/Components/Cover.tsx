import * as React from 'react'

const { useEffect } = React
interface Props {
  src: string;
  defaultSrc?: string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}
const icCoverDefault = require('../imgs/ic-album-default.svg')
const Cover = (props: Props) => {
  const { src, defaultSrc = icCoverDefault, className, style } = props
  const { onClick = () => {} } = props
  const [ url, setUrl ] = React.useState(src || defaultSrc)
  const handleLoadError = () => {
    setUrl(defaultSrc)
  }
  useEffect(() => {
    if (src) {
      setUrl(src)
    }
  }, [src])

  return (
    <img
      onClick={onClick}
      onError={handleLoadError}
      className={className}
      src={url || defaultSrc}
      style={style}
    />
  )
}

export default Cover
