import React, { useState, useEffect, useRef, useCallback } from 'react'
import { createRoot } from 'react-dom'
import { Search } from './Components/Search'
import { Library } from './Pages/Library'
import { Player } from './Components/Player'
import { Pagenation } from './Components/Pagenation'
import { scanLibrary, getLibrary, searchMusic, deleteMusic } from './API'
import { Music } from '../types/Music'
import { PLAY_MODE } from './consts'
import { RESP_STATE } from '../shareCommon/consts'
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

    const handleSwitchPlaying = useCallback((type) => async () => {
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
    }, [curIndex, list, curPage])

    const handlePlayNext = useCallback(handleSwitchPlaying(PLAY_MODE.next), [handleSwitchPlaying])

    const handlePlayError = async (curMusic) => {
        console.log('play cur audio error, check next.', curIndex)
        const isSure = confirm(`play ${curMusic ? curMusic.title + '-' + curMusic.artist : 'cur music'} error, delete it?`)
        if (isSure) {
            const {status, data} = await deleteMusic(music.id)
            if (status === 200) {
                if (data.status === RESP_STATE.success) {
                    console.log('delete success')
                }
                if (data.status === RESP_STATE.alreadyDone) {
                    console.log('already deleted')
                }
            }
        }
        await handlePlayNext()
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
