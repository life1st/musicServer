import React from 'react'
import style from './Library.module.less'

interface ILibrary {
    onItemClick: (any, number) => void;
    list: [];
}
export const Library = (props: ILibrary) => {
    const { onItemClick, list } = props
    
    const handleItemClick = (item, i) => {
        onItemClick && onItemClick(item, i)
    }

    return (
        <ul class={style.libraryContainer}>
            {
                list.map((item, i) => (
                    <li onClick={() => {handleItemClick(item, i)}}>{item.title}</li>
                ))
            }
        </ul>
    )
}
