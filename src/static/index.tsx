import React, { useState, useEffect } from 'react'
import { render } from 'react-dom'

import { Library } from './Pages/Library'
import { Player } from './Components/Player'
import { scanLibrary, getLibrary } from './API'

const App = () => {
    const [ audioId, setID ] = useState('')
    const [list, setList] = useState([])

    const handleItemClick = (item) => {
        setID(item.id)
    }
    const handleScan = () => {
        scanLibrary()
    }
    const handlePlayEnd = () => {
        const curIndex = list.findIndex(item => item.id === audioId)
        setID(list[curIndex + 1].id)
    }
    useEffect(() => {
        getLibrary(0).then(resp => {
            const { status, data } = resp
            if (status === 200) {
                setList(Object.keys(data).map(k => ({
                    title: data[k].info.title,
                    path: data[k].path,
                    id: k
                })))
            }
        })
    }, [])
    return (
        <div >
            <button onClick={handleScan}>Scan</button>
            <Library onItemClick={handleItemClick} list={list} />
            {audioId ? <Player src={`/api/music/${audioId}`} onPlayEnd={handlePlayEnd} /> : null}
        </div>
    )
    
}
render(<App/>, document.querySelector('.root'))