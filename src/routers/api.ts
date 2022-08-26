import Router from 'koa-router'
import { albumApiRoute } from './apis/albumApi'
import { libraryApiRoute } from './apis/libraryApi'
import { playlistApiRoute } from './apis/playlistApi'
import { checkAuthed, PW_CONST } from '../utils/auth'

const apiRoute = new Router()

apiRoute
.use(albumApiRoute.routes(), albumApiRoute.allowedMethods())
.use(libraryApiRoute.routes(), libraryApiRoute.allowedMethods())
.use(playlistApiRoute.routes(), playlistApiRoute.allowedMethods())
.get('/', async ctx => {
    ctx.body = 'hello from api handler.'
})
.get('/authed', async ctx => {
    const pass = checkAuthed(ctx)
    if (pass) {
        ctx.body = { status: 'authed' }
    } else {
        ctx.throw(403)
    }
})
.post('/auth', async ctx => {
    const { body }= ctx.request
    const { pw } = body
    const cookieConf = {
        httpOnly: true,
        overwrite: false
    }
    if (pw !== PW_CONST) {
        ctx.throw(403, 'invalid pw')
    } else {
        ctx.cookies.set('pw', pw, cookieConf)
        ctx.cookies.set('ts', Date.now(), cookieConf)
        ctx.body = 'ok'
    }
})

export { apiRoute }
