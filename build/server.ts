import path from 'path'
import fs from 'fs/promises'
import child_process from 'child_process'

const OUT_DIR = path.resolve('dist')
const TASKS_DIR = path.resolve('src/tasks')

const args = process.argv

const { isWatch, isBuild } = (() => {

    return {
        isWatch: args.includes('--watch'),
        isBuild: args.includes('--build')
    }
})()

const logError = (buf: Buffer) => {
    fs.writeFile('build_error.log', buf)
}

let hasRunServer = false
const runServer = async () => {
    if (hasRunServer) {
        return
    }
    console.log('running server')
    const server = child_process.spawn('nodemon', [`${OUT_DIR}/app.js`, '--watch dist/app.js'], { shell: true })
    hasRunServer = true
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

const buildTasks = async () => {
    const tasks = await fs.readdir(TASKS_DIR)
    for (const task of tasks) {
        const taskPath = path.resolve(TASKS_DIR, task)
        const basename = path.basename(taskPath, '.ts')
        const _args = `${taskPath} --bundle --platform=node --target=node18 --outfile=${OUT_DIR}/${basename}.js`.split(' ')
        if (isWatch) {
            _args.push('--watch')
        }
        const build = child_process.spawn(`esbuild`, _args, { shell: true })
        build.stdout.on('data', data => {
            console.log(data)
        })
        build.stderr.on('data', data => {
            const str = data.toString()
            console.log('stderr', str)
        })
        build.on('close', code => {
            console.log('build exited with code', code)
        })
    }
}

const buildServer = async () => {
    const SERVER_ENTRY = path.resolve('app.ts')
    // esbuild app.ts --bundle --platform=node --target=node18 --outfile=./dist/app.js
    const _args = [SERVER_ENTRY, '--bundle', '--platform=node', '--target=node18', `--outfile=${OUT_DIR}/app.js`]
    if (isWatch) {
        _args.push('--watch', '--sourcemap=inline')
    }
    if (isBuild) {
        _args.push('-minify')
    }
    const build = child_process.spawn(`esbuild`, _args, { shell: true })
    build.stdout.on('data', data => {
        console.log('[build Server]stdout: ', data)
    })
    build.stderr.on('data', data => {
        const str = data.toString()
        console.log('[build Server]stderr: ', str)
        if (str.includes('build finished') && !hasRunServer && isWatch) {
            runServer()
        }
    })
    build.on('close', code => {
        console.log('[build Server]build exited with code', code)
    })
}

const run = () => {
    buildServer()
    buildTasks()
}

run()