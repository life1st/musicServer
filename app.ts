import Koa from 'koa'
import staticHost from 'koa-static'
import bodyParser from 'koa-bodyparser'
import compress from 'koa-compress'
import { route } from './src/routers'
import { STATIC_DIR } from './src/utils/path'
import { staticHandler } from './src/routers/static'

const flush = require('zlib').constants.Z_SYNC_FLUSH
const app = new Koa()

app
.use(compress({
    filter: mime => /text|javascript|json/i.test(mime),
    threshold: 1000,
    gzip: { flush },
    deflate: { flush },
    br: false
}))
.use(staticHandler)
.use(staticHost(STATIC_DIR, {
    maxAge: 1000 * 60 * 60,
}))
.use(bodyParser())
.use(route.routes())

app.listen(3000, () => {
    console.log('app run@http://localhost:3000')
})
