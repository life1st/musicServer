import { useEffect, useRef } from 'react'

export const useCalColumn = ({
  baseWidth,
  containerRef
}: {
  baseWidth: number;
  containerRef: React.RefObject<HTMLElement | undefined>;
}) => {
  let width = useRef(baseWidth)
  useEffect(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.clientWidth
      const columns = Math.floor(containerWidth / baseWidth)
      width.current = Math.floor(containerWidth / columns)
    }
  }, [])
  return width.current
}