import { useEffect, MutableRefObject } from 'react'

export const useFocus = (ref: MutableRefObject<HTMLElement | undefined>) => {
  useEffect(() => {
    ref.current?.focus()
  } , [ref])
}
