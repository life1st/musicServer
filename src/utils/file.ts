import { existsSync, mkdirSync, writeFileSync } from 'fs'
import fs from 'fs/promises'
import md5 from 'md5'
import ID3 from 'node-id3'

export const getDir = (path: string): string => {
    if (!existsSync(path)){
        mkdirSync(path, { recursive: true });
    }
    return path
}

export const genFile = async (filePath: string): Promise<string> => {
    if (!existsSync(filePath)){
        writeFileSync(filePath, '')
    }
    return filePath;
}

export const isMusicFile = (filePath: string): boolean => {
    // await fs.read
    return filePath.includes('.mp3')
}

export const getFileId = async (fileBuf: Buffer): Promise<string> => {
    try {
        return md5(fileBuf)
    } catch(e) {
        return ''
    }
}

export const getMusicID3 = async (fileBuf: Buffer): Promise<ID3.Tags> => {
    try {
        const tags = ID3.read(fileBuf)
        return tags
    } catch (e) {
        console.log('get ID3 fail')
        return {}
    }
}

export const updateMusicID3 = async (path: string, tags: ID3.Tags): Promise<boolean> => {
    return Boolean(ID3.update(tags, path))
}
