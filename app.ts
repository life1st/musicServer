import Koa from 'koa'
import staticHost from 'koa-static'
import bodyParser from 'koa-bodyparser'
import { route } from './src/routers'
import fs from 'fs/promises'
import { STATIC_DIR } from './src/utils/path'
import { ROUTES } from './src/static/utils/routesPath'

const STATIC_PATHS = Object.keys(ROUTES).map(k => ROUTES[k].split('/')[1])
const app = new Koa()

app
.use(staticHost(STATIC_DIR, {
    maxAge: 1000 * 60 * 60
}))
.use(bodyParser())
.use(route.routes())
.use(async ctx => {
    const { method, url } = ctx.request
    const isIndex =  STATIC_PATHS.some(p => url.includes(p))
    const isGet = method.toLowerCase() === 'get'

    if (!ctx.body && isGet && isIndex) {
        ctx.body = await fs.readFile(`${STATIC_DIR}/index.html`, { encoding: 'utf-8'})
    }
})

app.listen(3000, () => {
    console.log('app run@http://localhost:3000')
})
