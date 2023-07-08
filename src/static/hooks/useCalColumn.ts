import { useEffect, useState } from 'react'

export const useCalColumn = ({
  baseWidth,
  minColumn = 0,
  containerRef
}: {
  baseWidth: number;
  minColumn?: number;
  containerRef: React.RefObject<HTMLElement | undefined>;
}) => {
  const [ domReady, setDomReady ] = useState(!!containerRef.current)
  const [ width, setWidth ] = useState(baseWidth)
  useEffect(() => {
    const isReady = !!containerRef.current
    setDomReady(isReady)
    if (isReady) {
      let containerWidth = containerRef.current.clientWidth - 10
      const columns = Math.max(Math.floor(containerWidth / baseWidth), minColumn)
      
      setWidth(Math.floor(containerWidth / columns))
    }
  }, [containerRef, baseWidth])
  return { columnWidth: width, isDomReady: domReady }
}