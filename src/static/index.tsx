import * as React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import { RecoilRoot, useRecoilValue } from 'recoil'
import { musicState } from './model/music'
import { Player } from './Components/Player'
import { scanLibrary } from './API'
import { useDocTitle } from './hooks/useDocTitle'
import { Pages } from './router'
import Navibar from './Components/Navibar'
import './global.less'
import 'reset-css'

const App = () => {
    const { music } = useRecoilValue(musicState)

    const handleScan = () => {
        scanLibrary()
    }
    useDocTitle(music ? `${music?.title} - ${music?.artist}` : 'Stop play - music center')

    return (
        <Router>
            <button onClick={handleScan}>Scan</button>
            <Pages />
            <Player />
            <Navibar />
        </Router>
    )
}

const root = createRoot(document.querySelector('.root'))
root.render(
    <RecoilRoot>
        <App />
    </RecoilRoot>
)
