import React, { useState, useEffect, useRef } from 'react'
import { createRoot } from 'react-dom'
import { Search } from './Components/Search'
import { Library } from './Pages/Library'
import { Player } from './Components/Player'
import { Pagenation } from './Components/Pagenation'
import { scanLibrary, getLibrary, searchMusic } from './API'
import { Music } from '../types/Music'
import { PLAY_MODE } from './consts'
import { useDocTitle } from './hooks/useDocTitle'

const App = () => {
    const [ music, setMusic ] = useState<Music>(null)
    const [ list, setList ] = useState<Music[]>([])
    const [ searchList, setSearchList ] = useState<Music[]>([])
    const [ curPage, setCurPage ] = useState(0)
    const [ curIndex, setCurIndex ] = useState(null)
    const loadedPages = useRef([])
    const autoPlayNext = useRef(false)

    const loadNextPage = () => {
        return getLibrary(curPage).then(resp => {
            const { status, data } = resp
            if (status === 200 
                && !loadedPages.current.includes(curPage)
                && data.length > 0
            ) {
                loadedPages.current.push(curPage)
                setList(list.concat(data))
                return true
            }
            return false
        })
    }

    const handleItemClick = (item, i) => {
        setCurIndex(i)
        setMusic(item)
    }
    const handleScan = () => {
        scanLibrary()
    }

    const handleSwitchPlaying = (type) => async () => {
        let nextIndex: number = -1
        if (type === PLAY_MODE.prev) {
            nextIndex  = curIndex - 1
        }
        if (type === PLAY_MODE.next) {
            nextIndex = curIndex + 1
        }
        if (type === PLAY_MODE.random) {
            nextIndex = Math.floor(Math.random() * list.length)
        }
        if (type === PLAY_MODE.next && nextIndex >= list.length) {
            setCurPage(curPage + 1)
            autoPlayNext.current = true
        }
        if (nextIndex >= 0 && nextIndex < list.length) {
            setMusic(list[nextIndex])
            setCurIndex(nextIndex)
        }
    }

    const handlePlayError = () => {
        console.log('play cur audio error, check next.', curIndex)
        handleSwitchPlaying(PLAY_MODE.next)()
    }

    const handleSearch = async (val) => {
        const resp = await searchMusic(val)
        const { status, data } = resp
        if (status === 200 && data) {
            setSearchList(data)
        }
    }
    const handleClearSearch = () => {
        setSearchList([])
    }

    useEffect(() => {
        loadNextPage().then((isLoad) => {
            if (isLoad && autoPlayNext.current) {
                autoPlayNext.current = false
                handleSwitchPlaying(PLAY_MODE.next)()
            }
        })
    }, [curPage])
    useDocTitle(music ? `${music?.title} - ${music?.artist}` : 'Stop play - music center')

    return (
        <div >
            <button onClick={handleScan}>Scan</button>
            <Search onSearch={handleSearch} onClear={handleClearSearch} />
            <Library onItemClick={handleItemClick} list={searchList.length > 0 ? searchList : list} />
            <Pagenation
                curPage={curPage}
                onLoadmore={() => setCurPage(curPage + 1)}
            />
            {music ? (
                <Player
                    music={music}
                    onPrevSong={handleSwitchPlaying(PLAY_MODE.prev)}
                    onNextSong={handleSwitchPlaying(PLAY_MODE.next)}
                    onPlayEnd={handleSwitchPlaying}
                    onPlayError={handlePlayError}
                />
            ) : null}
        </div>
    )
}

const root = createRoot(document.querySelector('.root'))
root.render(<App />)