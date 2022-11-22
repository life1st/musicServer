import * as React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, useMatch } from 'react-router-dom'
import { RecoilRoot } from 'recoil'
import Menubar from './Components/Menubar'
import { useGlobalTitle } from './hooks/useGlobalTitle'
import './global.less'
import 'reset-css'
import { darkModeSupport } from './utils/darkmodeHelper'

darkModeSupport()
const { useMemo, Fragment, lazy} = React

const Player = lazy(() => import('./Components/Player'))
const Pages = lazy(() => import('./router'))

const App = () => {
    const matchPlayer = useMatch('playing')
    const pageStyles = useMemo(() => {
        if (matchPlayer) {
            return { flex: '0 1 0' }
        }
        return {}
    }, [matchPlayer])
    useGlobalTitle({ useMatch })
    return (
        <Fragment>
            <div className='pages-content-container' style={pageStyles}>
                <Pages />
            </div>
            <Player />
            <Menubar />
        </Fragment>
    )
}

const root = createRoot(document.querySelector('.root'))
root.render(
    <RecoilRoot>
        <Router>
            <App />
        </Router>
    </RecoilRoot>
)
