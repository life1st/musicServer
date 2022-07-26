import React from 'react'


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
        <ul>
            {
                list.map((item, i) => (
                    <li onClick={() => {handleItemClick(item, i)}}>{item.title}</li>
                ))
            }
        </ul>
    )
}
