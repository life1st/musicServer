import * as React from 'react'
import * as style from './FullEditor.module.less'
import { useParams, useNavigate } from 'react-router-dom'
import { getMusicMeta, updateMeta } from '../API'
import { Music } from '../../types/Music'
import Navibar from '../Components/Navibar'

const { useEffect, useState } = React
const FullEditor = (props) => {
  const { id } = useParams()
  const [ meta, setMeta ] = useState<Music>({} as Music)
  const naviTo = useNavigate()

  const fetchMeta = async (id) => {
    const { status, data } = await getMusicMeta(id)
    if (status === 200) {
      setMeta(data.music)
    }
  }
  const handleBack = () => { naviTo(-1)}
  useEffect(() => {
    fetchMeta(id)
  }, [id])

  const handleChange = (key: string) => e => {
    const val = e.target.value
    console.log(key, val)
    if (typeof meta[key]) {

    }
    setMeta({ ...meta, [key]: val })
  }

  const handleUpdate = async () => {
    const {status, data} = await updateMeta(meta.id, meta)
    console.log(data)
    if (status === 200) {
      naviTo(-1)
    }
  }
  const renderMetaVal = (key: string) => {
    const hideKeys = ['id']
    const readOnlyKeys = ['path', 'size']
    if (hideKeys.includes(key)) {
      return null
    }
    let value = meta[key]
    if (key === 'size') {
      value = (value / 1024 / 1024).toFixed(2) + ' M'
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
        { Object.keys(meta).map(key => (
          <div key={key} className={style.editItem}>
            <p className={style.itemType}>{key}</p>
            {renderMetaVal(key)}
          </div>
        )) }
        <button className={style.btnUpdate} onClick={handleUpdate}>Update</button>
    </div>
  )
}

export default FullEditor
