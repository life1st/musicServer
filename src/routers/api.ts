import Router from 'koa-router'
import { albumApiRoute } from './apis/albumApi'
import { libraryApiRoute } from './apis/libraryApi'
import { playlistApiRoute } from './apis/playlistApi'
import { artistsApiRoute } from './apis/artistsApi'

const apiRoute = new Router()

apiRoute
.use(albumApiRoute.routes(), albumApiRoute.allowedMethods())
.use(libraryApiRoute.routes(), libraryApiRoute.allowedMethods())
.use(playlistApiRoute.routes(), playlistApiRoute.allowedMethods())
.use(artistsApiRoute.routes(), artistsApiRoute.allowedMethods())
.get('/', async ctx => {
    ctx.body = 'hello from api handler.'
})

export { apiRoute }
