
export const useCalColumn = ({
  baseWidth,
  containerRef
}: {
  baseWidth: number;
  containerRef: React.RefObject<HTMLElement | undefined>;
}) => {
  if (!containerRef.current) {
    return baseWidth
  }
  const containerWidth = containerRef.current?.clientWidth
  const columns = Math.floor(containerWidth / baseWidth)
  return Math.floor(containerWidth / columns)
}