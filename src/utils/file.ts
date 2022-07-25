import fs from 'fs/promises'
import md5 from 'md5'
import ID3 from 'node-id3'

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
    return filePath.includes('.mp3')
}

export const getMusicID3 = async (filePath) => {
    try {
        const buf = await fs.readFile(filePath)

        const tags = ID3.read(buf)
        return tags
    } catch (e) {
        console.log(e)
        return {}
    }
}
