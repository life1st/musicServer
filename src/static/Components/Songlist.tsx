import * as React from 'react'
import * as style from './Songlist.module.less'
import { Music } from '../../types/Music'
import { useThrottleFn } from 'ahooks'
const { useRef } = React

interface ILibrary {
    onItemClick: (any, number) => void;
    onReachEnd: () => void;
    list: Music[];
}
const Songlist = (props: ILibrary) => {
    const { list, onItemClick, onReachEnd } = props
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
        </ul>
    )
}

export default Songlist