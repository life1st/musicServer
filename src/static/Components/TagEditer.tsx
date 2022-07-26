import React, { useRef } from 'react'
import { updateMeta } from '../API'

export const TagEditer = (props) => {
    const { title, artist, album, id, onFinish } = props
    const editerRef = useRef()

    const handleUpdate = () => {
        const formEls = Array.from(editerRef.current?.querySelectorAll('input'))
        const tags = formEls.reduce((acc, el) => {
            acc[el.name] = el.value
            return acc
        }, {})
        const { status, data } = updateMeta(id, tags)
        onFinish(data?.isSuccess)
    }

    return (
        <div ref={editerRef}>
            <input type="text" name='title' defaultValue={title} /><br />
            <input type="text" name='artist' defaultValue={artist} /><br />
            <input type="text" name='album' defaultValue={album} /><br />

            <button onClick={handleUpdate}>Update</button>
        </div>
    )
}
