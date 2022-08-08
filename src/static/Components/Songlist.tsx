import * as React from 'react'
import * as style from './Songlist.module.less'
import { Music } from '../../types/Music'
import { useThrottleFn } from 'ahooks'
import icLoading from '../imgs/ic-loading.svg'
import icEmpty from '../imgs/ic-empty.svg'
const { useRef } = React

interface ILibrary {
    onItemClick: (m: Music, n: number) => void;
    onReachEnd: () => void;
    list: Music[];
    hasMore?: boolean;
}
const Songlist = (props: ILibrary) => {
    const { 
      list, hasMore,
      onItemClick, onReachEnd
    } = props
    const listRef = useRef<HTMLElement>()
    
    const handleItemClick = (item, i) => {
        onItemClick?.(item, i)
    }
    const { run: handleScroll, cancel, flush} = useThrottleFn(() => {
      if (listRef.current) {
        const { clientHeight, scrollTop, scrollHeight } = listRef.current
        if (clientHeight + scrollTop >= scrollHeight) {
          onReachEnd?.()
        }
      }
    }, { wait: 300 })

    return (
        <ul className={style.container} onScroll={handleScroll} ref={listRef}>
            { list.map((item, i) => (
                <li key={item.id} onClick={() => {handleItemClick(item, i)}}>{item.title}</li>
            )) }
            { hasMore 
              ? <img src={icLoading} className={style.iconEnd} /> 
              : (<div className={style.emptyTips}><img src={icEmpty} className={style.icEmpty} /><span className={style.tipsText}>没有了</span></div>)  }
        </ul>
    )
}

export default Songlist