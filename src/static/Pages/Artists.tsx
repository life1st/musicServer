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
import { useCalColumn } from '../hooks/useCalColumn'

const { useState, useEffect, useRef } = React

const Artists = (props) => {
  const naviTo = useNavigate()
  const setAlbumPageState = useSetRecoilState(albumPageState)
  const setArtistState = useSetRecoilState(artistState)
  const [ artists, setArtists ] = useState([])
  
  const containerRef = useRef()
  const BASE_WIDTH = 140
  const MIN_COLUMN = 3
  const { columnWidth, isDomReady } = useCalColumn({
    baseWidth: BASE_WIDTH,
    minColumn: MIN_COLUMN,
    containerRef
  })
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
      <Scroller className={style.artistsList} ref={containerRef}>
        { isDomReady ? artists.map(({name, cover}) => (
          <li
            style={{ width: columnWidth }}
            className={style.artistItem} 
            onClick={() => handleSearchArtist(name)}
            title={name}
            key={name}
          >
            <div className={style.coverContainer}
              style={{
                width: columnWidth,
                height: columnWidth,
              }}
            >
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
        )) : null }
      </Scroller>
    </>
  )
}

export default Artists