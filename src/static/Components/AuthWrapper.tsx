import * as React from 'react'
import { useNavigate, useMatch } from 'react-router-dom'
import { ROUTES } from '../consts'
import { sendAuth } from '../API'
const { useState } = React

const Auth = (props) => {
    const [ val, setVal ] = useState('')
    const naviTo = useNavigate()
    const matchAuth = useMatch(ROUTES.AUTH)
    const handleChange = (e) => {
        const val = e.target.value
        setVal(val)
    }
    const handleSubmit = async () => {
        const { status, data } = await sendAuth(val)
        if (status === 200 && data) {
            naviTo(-1)
        } else {
            // toast
            console.log('invalid pass')
            setVal('')
        }
    }
    if (!matchAuth) {
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