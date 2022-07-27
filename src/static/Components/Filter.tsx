import React, { useState } from 'react'
import arrow from '../imgs/arrow-down.svg'

const FilterItem = (props) => {
    const { title } = props
    const [ open, setOpen ] = useState(false)

    return (
        <div>
            <p>{title} <img src={arrow} /></p>
        </div>
    )
}

export const Filter = (props) => {
    const { conditions } = props

    return (
        <ul>

            <li>
            </li>
        </ul>
    )
}