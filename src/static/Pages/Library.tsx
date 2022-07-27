import React from 'react'
import style from './Library.module.less'
import { Music } from '../../types/Music'

interface ILibrary {
    onItemClick: (any, number) => void;
    list: Music[];
}
export const Library = (props: ILibrary) => {
    const { onItemClick, list } = props
    
    const handleItemClick = (item, i) => {
        onItemClick && onItemClick(item, i)
    }

    return (
        <ul className={style.libraryContainer}>
            { list.map((item, i) => (
                <li key={item.id} onClick={() => {handleItemClick(item, i)}}>{item.title}</li>
            )) }
        </ul>
    )
}
