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
    if (containerRef.current) {
      const containerWidth = containerRef.current.clientWidth - 5
      const columns = Math.max(Math.floor(containerWidth / baseWidth), minColumn)
      width.current = Math.floor(containerWidth / columns)
    }
  }, [])
  useEffect(() => {
    setDomReady(!!containerRef.current)
  }, [containerRef])
  return { columnWidth: width.current, isDomReady: domReady }
}