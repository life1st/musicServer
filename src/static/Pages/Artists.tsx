import * as React from 'react'
import * as style from './styles/Artists.module.less'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useSetRecoilState } from 'recoil'
import Cover from '../Components/Cover'
import { Scroller } from '../Components/Scroller'
import { albumPageState } from '../model/album'
import { ROUTES } from '../consts'
import Navibar from '../Components/Navibar'
const { useState, useEffect } = React

const Artists = (props) => {
  const naviTo = useNavigate()
  const setAlbumPageState = useSetRecoilState(albumPageState)
  const [ artists, setArtists ] = useState([])
  useEffect(() => {
    axios.get('/api/artists').then(resp => {
      console.log(resp, 'artitss')
      if (resp.status === 200) {
        setArtists(resp.data)
      }
    })
  }, [])
  const handleSearchArtist = (name) => {
    setAlbumPageState(state => ({
      ...state,
      searchText: name
    }))
    naviTo(ROUTES.ALBUMS)
  }
  return (
    <div>
      <Navibar />
      <Scroller className={style.artistsList}>
        { artists.map(({name, cover}) => (
          <div className={style.artistItem} onClick={() => handleSearchArtist(name)}>
            <Cover
              defaultSrc={require('../imgs/ic-artist-default.svg')}
              src={cover}
              disablePreview={true}
              className={style.artistCover}
            />
            {name}
          </div>
        )) }
      </Scroller>
    </div>
  )
}

export default Artists