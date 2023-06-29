import * as React from 'react'
import * as style from './styles/EditorCommon.module.less'
import { useParams, useNavigate } from 'react-router-dom'
import { useSetRecoilState, useRecoilValue } from 'recoil'
import { albumDetailState } from '../model/albumDetail'
import { getAlbumDetail, updateAlbumDetail } from '../API'
import Navibar from '../Components/Navibar'
import { Album } from '../../types/Album'

const { useEffect, useState } = React
const EditorForAlbum = (props) => {
  const { id } = useParams()
  const naviTo = useNavigate()

  const albumMeta = useRecoilValue(albumDetailState)
  const setAlbumMeta = useSetRecoilState(albumDetailState)
  const [ meta, setMeta ] = useState<Album | null>(albumMeta)
  
  const fetchMeta = async id => {
    const { status, data } = await getAlbumDetail(id)
    if (status === 200) {
      setAlbumMeta(data)
      setMeta(data)
    }
  }

  const handleBack = () => { naviTo(-1) }
  useEffect(() => {
    if (!albumMeta || albumMeta.albumId !== id) {
      fetchMeta(id)
    }
  }, [id])

  const handleChange = (key: string) => e => {
    const val = e.target.value
    console.log(key, val, meta?.[key])
    setMeta({ ...meta, [key]: val })
  }

  const handleUpdate = async () => {
    if (!meta) return
    const {status, data} = await updateAlbumDetail(meta.albumId, meta)
    console.log(data, meta)
    if (status === 200) {
      setAlbumMeta(_ => ({
        ..._,
        ...meta
      }))
      naviTo(-1)
    }
  }

  const renderMetaVal = (key: string) => {
    const hideKeys = ['musicIds', '_id', 'songs']
    const readOnlyKeys = ['path', 'size', 'albumId', 'coverId', 'coverUrl']
    if (hideKeys.includes(key)) {
      return null
    }
    let value = meta[key]
    if (readOnlyKeys.includes(key)) {
      return <p className={style.itemValue}>{value}</p>
    }
    if (!['string', 'number'].includes(typeof value)) {
      value = JSON.stringify(value)
      return <textarea value={value} className={style.itemAreaValue} onChange={handleChange(key)} />
    }
    return <input type="text" value={value} className={style.itemValue} onChange={handleChange(key)} />
  }

  return (
    <div className={style.container}>
        <Navibar onBack={handleBack} />
        <div className={style.contentContainer}>
          {meta ? Object.keys(meta).map(key => (
            <div key={key} className={style.editItem}>
              <p className={style.itemType}>{key}</p>
              {renderMetaVal(key)}
            </div>
          )) : null }
          <button className={style.btnUpdate} onClick={handleUpdate}>Update</button>
        </div>
    </div>
  )
}

export default EditorForAlbum
