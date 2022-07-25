import React, {useState, useEffect} from 'react'


interface ILibrary {
    onItemClick: (any) => void;
    list: [];
}
export const Library = (props: ILibrary) => {
    const { onItemClick, list } = props
    
    const handleItemClick = (item) => {
        onItemClick && onItemClick(item)
}
return (
        <ul>
            {
                list.map(item => (
                    <li onClick={() => {handleItemClick(item)}}>{item.title}</li>
                ))
            }
        </ul>
    )
}
