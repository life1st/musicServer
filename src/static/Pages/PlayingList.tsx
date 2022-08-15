import * as React from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { playingState } from '../model/playing'
import Songlist from '../Components/Songlist'
import Navibar from '../Components/Navibar'

const { Fragment } = React

const PlayingList = (props) => {
    const { list } = useRecoilValue(playingState)
    const setPlayingState = useSetRecoilState(playingState)
    const handleItemClick = () => {}

    const handleDeleted = (music) => {
        setPlayingState(_ => ({
            ..._,
            list: _.list.filter((m, i) => m.id !== music.id),
        }))
    }

    return (
        <Fragment>
            <Navibar />
            <Songlist
                list={list}
                deleteSuccess={handleDeleted}
                onItemClick={handleItemClick}
            />
        </Fragment>
    )
}

export default PlayingList