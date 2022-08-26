import * as React from 'react'
import { useRequest } from 'ahooks'
import { sendAuth, getAuthStatus } from '../API'
import { EndFix } from './Scroller'
import { MAX_AGE } from '../../utils/auth'
const { useState, useEffect } = React


const Auth = (props) => {
    const [ val, setVal ] = useState('')
    const handleChange = (e) => {
        const val = e.target.value
        setVal(val)
    }
    const handleSubmit = async () => {
        const { status, data } = await sendAuth(val)
        if (status === 200 && data) {
            refresh()
        } else {
            // toast
            console.log('invalid pass')
            setVal('')
        }
    }
    const { data: isAuthed, loading, error, refresh} = useRequest(getAuthStatus, {
        refreshOnWindowFocus: true,
        focusTimespan: MAX_AGE
    })

    if (loading) {
        return <EndFix hasMore={true} showLoading={true} />
    }
    if (isAuthed && !error) {
        return props.children
    }
    return (
        <div>
            <p>AUTH comp page</p>
            <input type="text" value={val} onChange={handleChange} />
            <button onClick={handleSubmit}>Submit</button>
        </div>
    )
}

export default Auth