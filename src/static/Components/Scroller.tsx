import * as React from 'react'
import * as style from './styles/Scroller.module.less'
import { useThrottleFn } from 'ahooks'

const { useRef, useEffect, useImperativeHandle, forwardRef } = React

interface Props {
  onReachEnd?: () => void;
  onScroll?: (scrollTop: number) => void;
  showLoading?: boolean;
  hasMore?: boolean;
  className?: string;
  initScrollTop?: number;
}
const Scroller = (props: React.PropsWithChildren<Props>, ref) => {
  const {
    onReachEnd = () => {},
    onScroll = () => {},
    showLoading,
    hasMore,
    className,
    initScrollTop,
  } = props

  const listRef = useRef<HTMLElement>()
  useEffect(() => {
    if (initScrollTop && listRef.current) {
      listRef.current.scrollTop = initScrollTop
    }
  }, [])
  useImperativeHandle(ref, () => ({
    clientWidth: listRef.current?.clientWidth,
  }))
  const { run: handleScroll, cancel, flush} = useThrottleFn(() => {
    if (listRef.current) {
      const { clientHeight, scrollTop, scrollHeight } = listRef.current
      onScroll(scrollTop)
      if (clientHeight + scrollTop >= scrollHeight - 20) {
        onReachEnd?.()
      }
    }
  }, { wait: 300 })

  const renderEnd = () => {
    if (showLoading && hasMore) {
      return <img src={require('../imgs/ic-loading.svg')} className={style.icLoading} />
    }
    if (!hasMore) {
      return (
        <div className={style.emptyTips}>
          <img src={require('../imgs/ic-empty.svg')} className={style.icEmpty} />
          <span className={style.tipsText}>没有了</span>
        </div>
      )
    }
    return null
  }
  return (
    <ul ref={listRef} onScroll={handleScroll} className={className}>
      {props.children}
      <li className={style.endFix}>{ renderEnd() }</li>
    </ul>
  )
}

export default forwardRef(Scroller)