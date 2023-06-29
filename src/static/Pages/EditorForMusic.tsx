import * as React from 'react'
import * as style from './styles/EditorCommon.module.less'
import { useParams, useNavigate } from 'react-router-dom'
import { getMusicMeta, updateMeta } from '../API'
import { Music } from '../../types/Music'
import Navibar from '../Components/Navibar'
import { copyText } from '../utils'
import { loading } from '../Components/ModalBox/Loading'
import { toast } from '../Components/ModalBox/Toast'

const { useEffect, useState } = React
const EditorForMusic = (props) => {
  const { id } = useParams()
  const [ meta, setMeta ] = useState<Music>({} as Music)
  const naviTo = useNavigate()
  
  const fetchMeta = async (id) => {
    const { status, data } = await getMusicMeta(id)
    if (status === 200) {
      setMeta(data.music)
    }
  }
  const handleBack = () => { naviTo(-1) }
  useEffect(() => {
    fetchMeta(id)
  }, [id])

  const handleChange = (key: string) => e => {
    let val = e.target.value
    console.log(key, val)
    if (!['string', 'number'].includes(typeof meta[key])) {
      try {
        val = JSON.parse(val)
      } catch {
        console.log('parse object error.')
        return
      }
    }
    setMeta({ ...meta, [key]: val })
  }

  const handleUpdate = async () => {
    const handleLoadingFinish = loading({ text: 'saving...' })
    const {status, data} = await updateMeta(meta.id, meta)
    console.log(data)
    handleLoadingFinish()
    if (status === 200) {
      toast({ text: 'save success' })
      handleBack()
    }
  }

  const handleCopy = async (text) => {
    const res = await copyText(text)
    console.log(text + res ? 'copy success' : 'copy failed')
  }
  const renderMetaVal = (key: string) => {
    const hideKeys = ['id']
    const readOnlyKeys = ['path', 'size', 'albumId']
    if (hideKeys.includes(key)) {
      return null
    }
    let value = meta[key]
    if (key === 'size') {
      value = (value / 1024 / 1024).toFixed(2) + ' M'
    }
    if (key === 'path') {
      return <p className={style.itemValue}>{value.split('/').map(p => (
        <span className={style.pathFragment} key={p} onClick={() => {handleCopy(p)}}>{p} /</span>
      ))}</p>
    }
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
          { Object.keys(meta).map(key => (
            <div key={key} className={style.editItem}>
              <p className={style.itemType}>{key}</p>
              {renderMetaVal(key)}
            </div>
          )) }
          <button className={style.btnUpdate} onClick={handleUpdate}>Update</button>
        </div>
    </div>
  )
}

export default EditorForMusic
