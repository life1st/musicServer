import path from 'path'
import child_process from 'child_process'
import esbuild from 'esbuild'

const OUT_DIR = path.resolve('dist')

const args = process.argv
const { isWatch, isBuild } = (() => {
    return {
        isWatch: args.includes('--watch'),
        isBuild: args.includes('--build')
    }
})()


let isRuningServer = false
const runServer = async () => {
    if (isRuningServer) {
        return
    }
    console.log('running server')
    const server = child_process.spawn('nodemon', [`${OUT_DIR}/app.js`, '--watch dist/app.js'], { shell: true })
    isRuningServer = true
    server.stdout.on('data', data => {
        console.log(`[runServer]stdout:\n${data}`)
    })
    server.stderr.on('data', data => {
        console.log(`[runServer]stderr: ${data}`)
    })
    server.on('close', code => {
        console.log(`[runServer]child process exited with code ${code}`)
    })
}
const buildApp = async () => {
    console.log(isWatch, isBuild)
    if (isRuningServer) {
        console.log('is runing')
        return
    }
    const dynamicParams = {} as any
    if (isWatch) {
        dynamicParams.watch = {
            onRebuild: (err: string, result: string) => {
                if (err) console.error('watch build failed:', err)
                else console.log(`[${Date.now()}]watch build succeeded:`, result)
            }
        }
    }
    if (isBuild) {
        dynamicParams.minify = true
    }
    esbuild.build({
        entryPoints: [
            'app.ts'
        ],
        outdir: './dist',
        platform: 'node',
        bundle: true,
        splitting: true,
        format: 'esm',
        ...dynamicParams,
    }).then((r: any) => {
        console.log('r', r)
    })
}
buildApp()