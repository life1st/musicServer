import * as React from 'react'
import { useRecoilState } from 'recoil'
import { artistState } from '../model/artistEditor'
import Navibar from '../Components/Navibar'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../consts'
import Cover from '../Components/Cover'

const { useEffect } = React
const EditorForArtist = (props) => {
  const [artist, setArtist] = useRecoilState(artistState)
  const naviTo = useNavigate()
  useEffect(() => {
    if (Object.keys(artist).every(k => !artist[k])) {
      naviTo(ROUTES.ARTISTS)
    }
  }, [])
  const handleInput = (e) => {
    console.log('input', e)
  }
  const handleUpload = (e) => {
    console.log('upload', e.target.files)
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
        />
        <input type="file" onChange={handleUpload} />
      </p>
      artist editor
    </div>
  )
}

export default EditorForArtist
