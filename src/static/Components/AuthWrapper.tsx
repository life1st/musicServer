import * as React from 'react'
import { useNavigate, useMatch } from 'react-router-dom'
import { ROUTES } from '../consts'
import { sendAuth, getAuthStatus } from '../API'
import { EndFix } from './Scroller'
const { useState, useEffect } = React

const Auth = (props) => {
    const [ loading, setLoading ] = useState(true)
    const [ isAuthed, setIsAuthed ] = useState(false)
    const [ val, setVal ] = useState('')
    const handleChange = (e) => {
        const val = e.target.value
        setVal(val)
    }
    const handleSubmit = async () => {
        setLoading(true)
        const { status, data } = await sendAuth(val)
        setLoading(false)
        if (status === 200 && data) {
            setIsAuthed(true)
        } else {
            // toast
            console.log('invalid pass')
            setVal('')
        }
    }

    useEffect(() => {
        getAuthStatus().then(resp => {
            setLoading(false)
            const { status, data } = resp
            console.log(data)
            if (status === 200) {
                setIsAuthed(true)
            }
        })
    }, [])

    if (loading) {
        return <EndFix hasMore={true} showLoading={true} />
    }
    if (isAuthed) {
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