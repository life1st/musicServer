import { useEffect, useRef, useState } from 'react'

export const useCalColumn = ({
  baseWidth,
  minColumn = 0,
  containerRef
}: {
  baseWidth: number;
  minColumn?: number;
  containerRef: React.RefObject<HTMLElement | undefined>;
}) => {
  let width = useRef(baseWidth)
  let [ domReady, setDomReady ] = useState(!!containerRef.current)
  useEffect(() => {
    const isReady = !!containerRef.current
    setDomReady(isReady)
    if (isReady) {
      let containerWidth = containerRef.current.clientWidth - 10
      const columns = Math.max(Math.floor(containerWidth / baseWidth), minColumn)
      
      width.current = Math.floor(containerWidth / columns)
    }
  }, [containerRef])
  
  return { columnWidth: width.current, isDomReady: domReady }
}