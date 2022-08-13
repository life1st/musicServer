import * as React from 'react'

const { useEffect } = React
interface Props {
  src: string;
  defaultSrc?: string;
  className?: string;
  onClick?: () => void;
}
const icCoverDefault = require('../imgs/ic-album-default.svg')
const Cover = (props: Props) => {
  const { src, defaultSrc = icCoverDefault, className } = props
  const { onClick = () => {} } = props
  const [url, setUrl] = React.useState(src)
  const handleLoadError = () => {
    setUrl(defaultSrc)
  }
  useEffect(() => {
    setUrl(src)
  }, [src])

  return (
    <img
      onClick={onClick}
      className={className}
      src={url || defaultSrc}
      onError={handleLoadError}
    />
  )
}

export default Cover
