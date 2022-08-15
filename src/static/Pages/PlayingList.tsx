import * as React from 'react'
import { useRecoilValue } from 'recoil'
import { playingState } from '../model/playing'
import Songlist from '../Components/Songlist'
import Navibar from '../Components/Navibar'

const { Fragment } = React

const PlayingList = (props) => {
    const { list } = useRecoilValue(playingState)
    const handleItemClick = () => {}

    return (
        <Fragment>
            <Navibar />
            <Songlist
                list={list}
                onItemClick={handleItemClick}
            />
        </Fragment>
    )
}

export default PlayingList