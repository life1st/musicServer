import fs from 'fs/promises'
import path from 'path'
import { isMusicFile } from '../utils/file'

process.on('message', async (dir: string) => {
    const files = await fs.readdir(dir)
    const tmpDirs: string[] = []
    const musicFiles: string[] = []
    for (const file of files) {
        const fullPath = path.join(dir, file)
        const [isMusic, stat] = await Promise.all([
            isMusicFile(fullPath),
            fs.stat(fullPath)
        ])
        if (isMusic) {
            musicFiles.push(fullPath)
        } else if (stat.isDirectory()) {
            tmpDirs.push(fullPath)
        }
    }

    if (!process.send) {
        throw new Error('No process.send')
    }
    process.send([tmpDirs, musicFiles])
})
