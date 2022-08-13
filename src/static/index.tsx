import * as React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import { RecoilRoot } from 'recoil'
import { Player } from './Components/Player'
import { Pages } from './router'
import Menubar from './Components/Menubar'
import './global.less'
import 'reset-css'

const App = () => {

    return (
        <Router>
            <div className='pages-content-container'>
                <Pages />
            </div>
            <Player />
            <Menubar />
        </Router>
    )
}

const root = createRoot(document.querySelector('.root'))
root.render(
    <RecoilRoot>
        <App />
    </RecoilRoot>
)
