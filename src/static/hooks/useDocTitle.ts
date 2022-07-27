import { useEffect } from 'react'

export const useDocTitle = (title: string) => {
  const prevTitle = document.title
  const reset = () => {
    document.title = prevTitle
  }

  useEffect(() => {
    document.title = title
    return () => reset
  }, [title])

  return { reset }
}
