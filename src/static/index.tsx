import React, { useState, useEffect, useRef } from 'react'
import { render } from 'react-dom'

import { Library } from './Pages/Library'
import { Player } from './Components/Player'
import { Pagenation } from './Components/Pagenation'
import { scanLibrary, getLibrary } from './API'

const App = () => {
    const [ music, setMusic ] = useState(null)
    const [ list, setList ] = useState([])
    const [ curPage, setCurPage ] = useState(0)
    const loadedPages = useRef([])

    const handleItemClick = (item) => {
        setMusic(item)
    }
    const handleScan = () => {
        scanLibrary()
    }
    const handlePlayEnd = () => {
        const curIndex = list.findIndex(item => item.id === music.id)
        if (curIndex + 1 < list.length) {
            setMusic(list[curIndex + 1])
        }
    }
    useEffect(() => {
        getLibrary(curPage).then(resp => {
            const { status, data } = resp
            if (status === 200 
                && !loadedPages.current.includes(curPage)
                && data.length > 0
            ) {
                loadedPages.current.push(curPage)
                setList(list.concat(data))
            }
        })
    }, [curPage])
    return (
        <div >
            <button onClick={handleScan}>Scan</button>
            <Library onItemClick={handleItemClick} list={list} />
            <Pagenation
                curPage={curPage}
                onLoadmore={() => setCurPage(curPage + 1)}
            />
            {music ? <Player music={music} onPlayEnd={handlePlayEnd} /> : null}
        </div>
    )
}
render(<App/>, document.querySelector('.root'))