import axios from 'axios'
import { LRC_DIR } from './path'
import fs from 'fs/promises'
import path from 'path'

// console.log(modules)
export const fetchLyrics = async (name, artist) => {
  
  const data = await axios.get('')
  console.log(data)
  return data
}

export const saveLyrics = async (id, content) => {
  if (!content) {
    return false
  }
  await fs.writeFile(path.join(LRC_DIR, id), content)
  return true
}