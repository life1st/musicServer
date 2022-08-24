import fs from 'fs/promises'
import { ROUTES } from '../static/consts'
import { STATIC_DIR } from '../utils/path'

const STATIC_PATHS = Object.keys(ROUTES).map(k => ROUTES[k].split('/')[1])

let indexFile: any = null

export const staticHandler = async (ctx, next) => {
    await next()
    const { method, url } = ctx.request
    const isIndex =  STATIC_PATHS.some(p => url.includes(p))
    const isGet = method.toLowerCase() === 'get'

    if (!ctx.body && isGet && isIndex) {
        if (!indexFile) {
            indexFile = await fs.readFile(`${STATIC_DIR}/index.html`, { encoding: 'utf-8'})
        }
        ctx.body = indexFile
    }
}
