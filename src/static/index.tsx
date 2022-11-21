import * as React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, useMatch } from 'react-router-dom'
import { RecoilRoot } from 'recoil'
import { Player } from './Components/Player'
import { Pages } from './router'
import Menubar from './Components/Menubar'
import { useGlobalTitle } from './hooks/useGlobalTitle'
import './global.less'
import 'reset-css'
import dayJs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { 
    auto as followSystemColorScheme,
    enable as enableDarkMode,
} from 'darkreader'
import { darkModeConfig, autoDarkModeUtils } from './utils/darkmodeHelper'

dayJs.extend(relativeTime)
const autoEnableDarkMode = autoDarkModeUtils.getEnabledAuto()
if (autoEnableDarkMode) {
    followSystemColorScheme(darkModeConfig) // enable auto darkmode
} else if (autoDarkModeUtils.isUsingDark()) { // auto disabled, use saved setting.
    enableDarkMode(darkModeConfig)
}

const { useMemo, Fragment} = React

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
