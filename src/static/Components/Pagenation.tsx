import * as React from 'react'

export const Pagenation = (props) => {
    const { curPage = '', onLoadmore } = props

    return (
        <div>
            <p>Page: {curPage}</p>
            <button onClick={onLoadmore}>More</button>
        </div>
    )
}