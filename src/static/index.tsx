import React, { useState, useEffect, useMemo } from 'react'
import { render } from 'react-dom'

import { Library } from './Pages/Library'
import { Player } from './Components/Player'
import { scanLibrary, getLibrary } from './API'

const App = () => {
    const [ music, setMusic ] = useState(null)
    const [ list, setList ] = useState([])

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
        getLibrary(0).then(resp => {
            const { status, data } = resp
            if (status === 200) {
                setList(data)
            }
        })
    }, [])
    return (
        <div >
            <button onClick={handleScan}>Scan</button>
            <Library onItemClick={handleItemClick} list={list} />
            {music ? <Player music={music} onPlayEnd={handlePlayEnd} /> : null}
        </div>
    )
    
}
render(<App/>, document.querySelector('.root'))