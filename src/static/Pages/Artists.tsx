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
import { artistState } from '../model/artistEditor'
const { useState, useEffect } = React

const Artists = (props) => {
  const naviTo = useNavigate()
  const setAlbumPageState = useSetRecoilState(albumPageState)
  const setArtistState = useSetRecoilState(artistState)
  const [ artists, setArtists ] = useState([])
  const fetchArtists = () => {
    axios.get('/api/artists').then(resp => {
      if (resp.status === 200) {
        setArtists(resp.data.sort((a, b) => a.pinyin.charCodeAt(0) - b.pinyin.charCodeAt(0)))
      }
    })
  }
  useEffect(() => {
    fetchArtists()
  }, [])
  const handleSearchArtist = (name) => {
    setAlbumPageState(state => ({
      ...state,
      searchText: name
    }))
    naviTo(ROUTES.ALBUMS)
  }
  const handleDelete = (e, name) => {
    e.stopPropagation()
    const isConfirm = confirm(`删除${name}?`)
    if (isConfirm) {
      axios.delete(`/api/artist/${name}`).then(resp => {
        console.log(resp)
        fetchArtists()
      })
    }
  }
  const handleEdit = (e, name) => {
    e.preventDefault()
    e.stopPropagation()
    setArtistState(state => ({
      ...state,
      name,
    }))
    naviTo(ROUTES.ARTIST_EDITOR)
  }
  const handleScan = () => {
    axios.post('/api/artists/scan')
  }
  return (
    <>
      <Navibar rightNode={(
        <p className={style.scanBtn} onClick={handleScan}>scan</p>
      )} />
      <Scroller className={style.artistsList}>
        { artists.map(({name, cover}) => (
          <li
            className={style.artistItem} 
            onClick={() => handleSearchArtist(name)}
            title={name}
            key={name}
          >
            <div className={style.coverContainer}>
              <Cover
                defaultSrc={require('../imgs/ic-artist-default.svg')}
                src={`/file/artist_cover/${cover}`}
                disablePreview={true}
                className={style.artistCover}
              />
              <img 
                src={require('../imgs/ic-delete.svg')} 
                title="删除" 
                className={style.artistDelete} 
                onClick={e => handleDelete(e, name)}
              />
              <img 
                src={require('../imgs/ic-edit.svg')} 
                title="编辑" 
                className={style.artistEdit} 
                onClick={e => handleEdit(e, name)}
              />
            </div>
            <p className={style.artistName}>{name}</p>
          </li>
        )) }
      </Scroller>
    </>
  )
}

export default Artists