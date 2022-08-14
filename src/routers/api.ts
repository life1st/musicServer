import Router from 'koa-router'
import { albumApiRoute } from './apis/albumApi'
import { libraryApiRoute } from './apis/libraryApi'

const apiRoute = new Router()

apiRoute
.use(albumApiRoute.routes(), albumApiRoute.allowedMethods())
.use(libraryApiRoute.routes(), libraryApiRoute.allowedMethods())
.get('/', async ctx => {
    ctx.body = 'hello from api handler.'
})

export { apiRoute }
