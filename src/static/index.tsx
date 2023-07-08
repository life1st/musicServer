import * as React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, useMatch } from 'react-router-dom'
import debounce from 'lodash.debounce'
import { RecoilRoot, useRecoilState } from 'recoil'
import { globalData } from './model/global'
import Menubar from './Components/Menubar'
import { useGlobalTitle } from './hooks/useGlobalTitle'
import './global.less'
import 'reset-css'
import { darkModeSupport } from './utils/darkmodeHelper'
import Player from './Components/Player'

darkModeSupport()
const { useMemo, useEffect, useCallback, Fragment, lazy} = React

const Pages = lazy(() => import('./router'))

const App = () => {
    const matchPlayer = useMatch('playing')
    const styles = useMemo(() => {
        if (matchPlayer) {
            return {
                page: {flex: '0 1 0'},
                player: {
                    display: 'flex',
                    flex: 1,
                }
            }
        }
        return {}
    }, [matchPlayer])
    const [{ isWideScreen }, setGlobalData] = useRecoilState(globalData)
    const getScreenWidth = useCallback(debounce(() => {
        const { width } = document.body.getBoundingClientRect() || {}
        setGlobalData((_state) => ({
            ..._state,
            isWideScreen: width >= 900
        }))
    }, 500), [])
    useEffect(() => {
        getScreenWidth()
        window.addEventListener('resize', getScreenWidth)
        return () => {
            window.removeEventListener('resize', getScreenWidth)
        }
    }, [])
    useGlobalTitle({ useMatch })
    return (
        <Fragment>
            <div className='pages-content-container' style={styles.page}>
                <Pages />
                { isWideScreen ? (
                    <div className='pages-full-nav'>
                        <Menubar />
                    </div>
                ) : null }
            </div>
            <div className='page-full-player' style={styles.player}>
                <Player />
            </div>
            {isWideScreen ? null : <Menubar />}
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
