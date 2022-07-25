import fs from 'fs/promises'
import md5 from 'md5'

export const getFileId = async filePath => {
    try {
        const fileBuf = await fs.readFile(filePath)
        return md5(fileBuf)
    } catch(e) {
        return null
    }
}

export const isMusicFile = async filePath => {
    // await fs.read
    return false
}