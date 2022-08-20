import Koa from 'koa'
import staticHost from 'koa-static'
import bodyParser from 'koa-bodyparser'
import { route } from './src/routers'
import fs from 'fs/promises'
import { STATIC_DIR } from './src/utils/path'
import { ROUTES } from './src/static/utils/routesPath'

const STATIS_PATHS = Object.keys(ROUTES).map(k => ROUTES[k].split('/')[1])
const app = new Koa()

app
.use(staticHost(STATIC_DIR))
.use(bodyParser())
.use(route.routes())
.use(async ctx => {
    const { method, url } = ctx.request
    if (!ctx.body && method.toLowerCase() === 'get' && STATIS_PATHS.some(p => url.includes(p))) {
        ctx.body = await fs.readFile(`${STATIC_DIR}/index.html`, { encoding: 'utf-8'})
    }
})


app.listen(3000, () => {
    console.log('app run@http://localhost:3000')
})
