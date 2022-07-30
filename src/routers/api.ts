import Router from 'koa-router'
import { library } from '../controller/library'

const apiRoute = new Router()

apiRoute
.get('/', async ctx => {
    ctx.body = 'hello from api handler.'
})
.post('/scan', async ctx => {
    try {
        const [scanning, finish] = await library.scan()
        ctx.body = { isScan: true, waiting: scanning, finish }
    } catch (e) {
        ctx.status = 500
        ctx.body = { isScan: false, e }
    }
})
.post('/music_meta/:id', async ctx => {
    const { id } = ctx.params
    const { body } = ctx.request
    const isSuccess = await library.updateMeta(id, body)
    ctx.body = { isSuccess }
})
.get('/music_list/:pageNum', async ctx => {
    const { pageNum } = ctx.params

    ctx.body = await library.getMusicList(pageNum)
})
.get('/search_music/:pageNum', async ctx => {
    const { pageNum } = ctx.params
    const { query } = ctx.request
    const { q } = query
    ctx.body = await library.searchMusic(q, { pageNum })
})
.get('/music/:id', async ctx => {
    const { id } = ctx.params
    const { music, stream, size} = await library.getMusic(id)
    console.log('resp music file', music)
    ctx.set('content-type', 'audio/mpeg')
    ctx.set('Accept-Ranges', 'bytes')
    ctx.set('Content-Length', size)
    ctx.body = stream
})
.delete('/music/:id', async ctx => {
    const { id } = ctx.params
    const status = await library.deleteMusic(id)
    ctx.body = { status }
})

export { apiRoute }
