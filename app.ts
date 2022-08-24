import Koa from 'koa'
import staticHost from 'koa-static'
import bodyParser from 'koa-bodyparser'
import { route } from './src/routers'
import { STATIC_DIR } from './src/utils/path'
import { staticHandler } from './src/routers/static'

const app = new Koa()

app
.use(staticHandler)
.use(staticHost(STATIC_DIR, {
    maxAge: 1000 * 60 * 60
}))
.use(bodyParser())
.use(route.routes())

app.listen(3000, () => {
    console.log('app run@http://localhost:3000')
})
