import { useEffect, useRef, useState } from 'react'

export const useCalColumn = ({
  baseWidth,
  containerRef
}: {
  baseWidth: number;
  containerRef: React.RefObject<HTMLElement | undefined>;
}) => {
  let width = useRef(baseWidth)
  let [ domReady, setDomReady ] = useState(!!containerRef.current)
  useEffect(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.clientWidth
      const columns = Math.floor(containerWidth / baseWidth)
      width.current = Math.floor(containerWidth / columns)
    }
  }, [])
  useEffect(() => {
    setDomReady(!!containerRef.current)
  }, [containerRef])
  return { columnWidth: width.current, isDomReady: domReady }
}