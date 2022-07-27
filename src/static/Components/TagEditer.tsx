import React, { Fragment, useRef } from 'react'
import { updateMeta } from '../API'

interface Props {
    title: string;
    artist: string;
    album: string;
    id: string;
    onFinish: (finish: boolean) => void
}
export const TagEditer = (props: Props) => {
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
            { ['title', 'artist', 'album'].map(k => (
                <Fragment>
                    <input key={k} type="text" placeholder={k} name={k} defaultValue={props[k]} /><br />
                </Fragment>
            )) }
            <button onClick={handleUpdate}>Update</button>
        </div>
    )
}
