import fs from 'fs/promises'
process.on('message', (path: string) => {
    const files = fs.readdir(path)
    const tmpDirs = []
    const musicFiles = []
    console.log(files)

    process.send([tmpDirs, musicFiles])
})