import Koa from 'koa'
import staticHost from 'koa-static'
import { route } from './src/routers'

const app = new Koa()

app
.use(staticHost('dist'))
.use(route.routes())

app.listen(3000, () => {
    console.log('app run@http://localhost:3000')
})
