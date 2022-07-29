import fs from 'fs/promises'
import { getMusicData } from '../utils/music'

process.on('message', async (musicPath: string) => {
    console.log('music process receive: ', musicPath)
    if (!musicPath) {
        return
    }
    const music = await getMusicData(musicPath)
    console.log('getMusicMeta', music)
    process.send?.(music)
})
