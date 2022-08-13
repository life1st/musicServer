import * as React from 'react'

interface Props {
  src: string;
  defaultSrc?: string;
  className?: string;
}
const icCoverDefault = require('../imgs/ic-album-default.svg')
const Cover = (props: Props) => {
  const { src, defaultSrc = icCoverDefault, className } = props
  const [url, setUrl] = React.useState(src)
  const handleLoadError = () => {
    setUrl(defaultSrc)
  }

  return (
    <img
      className={className}
      src={url}
      onError={handleLoadError}
    />
  )
}

export default Cover
