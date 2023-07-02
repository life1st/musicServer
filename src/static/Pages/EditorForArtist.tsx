import * as React from 'react'
import * as style from './styles/EditorCommon.module.less'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useRecoilState } from 'recoil'
import { artistState } from '../model/artistEditor'
import { ROUTES } from '../consts'
import Navibar from '../Components/Navibar'
import Cover from '../Components/Cover'
import { toast } from '../Components/ModalBox/Toast'

const { useEffect, useState } = React
const EditorForArtist = (props) => {
  const [artist, setArtist] = useRecoilState(artistState)
  const [ covername, setCovername ] = useState('')
  const naviTo = useNavigate()
  useEffect(() => {
    if (Object.keys(artist).every(k => !artist[k])) {
      naviTo(ROUTES.ARTISTS)
    }
  }, [])

  const handlePreview = async (file) => {
    const fileReader = new FileReader()
    const url = await new Promise((resolve) => {
      fileReader.onload = (e) => {
        resolve(e.target.result)
      }
      fileReader.readAsDataURL(file)
    })
    setArtist({
      ...artist,
      cover: url,
    })
  }
  const handleInput = (e) => {
    console.log('input', e)
  }
  const handleUpload = async (e) => {
    console.log('upload', e.target.files)
    const file = e.target.files[0]
    handlePreview(file)
    const formdata = new FormData()
    formdata.append('file', file)
    formdata.append('name', artist.name)
    axios.post('/file/cover', formdata).then(resp => {
      if (resp.data?.success) {
        setCovername(resp.data.filename)
      }
    })
  }
  const handleSubmit = () => {
    if (!covername) {
      return
    }
    axios.post(`/api/artist/${encodeURIComponent(artist.name)}`, {
      covername
    }).then(resp => {
      if (resp.data?.status) {
        naviTo(ROUTES.ARTISTS)
      } else {
        toast({text: 'update failed.'})
      }
    })
  }
  return (
    <div>
      <Navibar />
      <p>
        <input type="text" value={artist.name} onChange={handleInput} />
      </p>
      <p>
        <Cover
          defaultSrc={require('../imgs/ic-artist-default.svg')}
          src={artist.cover}
          disablePreview={true}
          className={style.artistCover}
        />
        <input type="file" onChange={handleUpload} />
      </p>
      <button onClick={handleSubmit}>Submit</button>
    </div>
  )
}

export default EditorForArtist
