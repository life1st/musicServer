import fs from 'fs/promises'
import { getMusicData } from '../utils/music'

process.on('message', async (musicPath: string) => {
    if (!musicPath) {
        return
    }
    const music = await getMusicData(musicPath)
    process.send?.(music)
})
