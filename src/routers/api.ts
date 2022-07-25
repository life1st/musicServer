import Router from 'koa-router'
import { library } from '../controller/library'

const apiRoute = new Router()

apiRoute
.get('/', async ctx => {
    ctx.body = 'hello from api handler.'
})
.post('/scan', async ctx => {
    try {
        library.scan()
        ctx.body = { isScan: true }
    } catch (e) {
        ctx.status = 500
        ctx.body = { isScan: false, e }
    }
})
.get('/music_list/:pageNum', async ctx => {
    const { pageNum } = ctx.params

    ctx.body = await library.getMusicList(pageNum)
})
.get('/music/:id', async ctx => {
    const { id } = ctx.params
    const {stream, size} = await library.getMusic(id)
    ctx.set('content-type', 'audio/mpeg')
    ctx.set('Accept-Ranges', 'bytes')
    ctx.set('Content-Length', size)
    ctx.body = stream
})

export { apiRoute }
