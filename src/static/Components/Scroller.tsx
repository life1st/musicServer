import * as React from 'react'
import * as style from './styles/Scroller.module.less'
import { useThrottleFn } from 'ahooks'
import { Svg } from './Svg'

const { useRef, useEffect, useImperativeHandle, forwardRef } = React

const EndFix = ({showLoading, hasMore}) => {
  if (showLoading && hasMore) {
    return <div><Svg src={require('../imgs/ic-loading.svg')} className={style.icLoading} /></div>
  }
  if (!hasMore) {
    return (
      <div className={style.emptyTips}>
        <Svg src={require('../imgs/ic-empty.svg')} className={style.icEmpty} />
        <span className={style.tipsText}>没有了</span>
      </div>
    )
  }
  return null
}
interface Props {
  onReachEnd?: () => void;
  onScroll?: (scrollTop: number) => void;
  showLoading?: boolean;
  hasMore?: boolean;
  className?: string;
  initScrollTop?: number;
}
const Scroller = forwardRef((props: React.PropsWithChildren<Props>, ref) => {
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

  return (
    <ul ref={listRef} onScroll={handleScroll} className={className}>
      {props.children}
      <li className={style.endFix}>
        <EndFix showLoading={showLoading} hasMore={hasMore} />
      </li>
    </ul>
  )
})

export { Scroller, EndFix }