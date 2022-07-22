import Koa from 'koa'
import { route } from './src/routers'

const app = new Koa()

app
.use(route.routes())
.use(async ctx => {
    console.log(ctx)
    if (!ctx.body) {
        ctx.body = 'default'
    }
})

app.listen(3000, () => {
    console.log('app run@http://localhost:3000')
})
