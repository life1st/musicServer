import Koa from 'koa'
import staticHost from 'koa-static'
import bodyParser from 'koa-bodyparser'
import { route } from './src/routers'
import fs from 'fs/promises'

const app = new Koa()

app
.use(staticHost('dist'))
.use(bodyParser())
.use(route.routes())
.use(async ctx => {
    if (!ctx.body) {
        ctx.body = await fs.readFile('dist/index.html', { encoding: 'utf-8'})
    }
})


app.listen(3000, () => {
    console.log('app run@http://localhost:3000')
})
