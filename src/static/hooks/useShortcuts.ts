import { useEffect } from "react"
import { useMemoizedFn } from 'ahooks'

export const useShortcuts = (shortcuts: {
  [key: string]: {
    ctrl?: boolean;
    handler: (config: any) => void;
  }
}) => {
  const keydownHandler = useMemoizedFn(e => {
    const { ctrlKey, code } = e
    const shortcut = shortcuts[code.toLowerCase()]
    if (shortcut) {
      if (!shortcut.ctrl || (shortcut.ctrl && ctrlKey)) {
        shortcut.handler?.({ctrl: ctrlKey})
      }
    }
  })
  useEffect(() => {
    document.body.addEventListener('keydown', keydownHandler)
    return () => {
      document.body.removeEventListener('keydown', keydownHandler)
    }
  } , [shortcuts])
}
