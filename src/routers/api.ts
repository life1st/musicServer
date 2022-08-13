import Router from 'koa-router'
import { library } from '../controller/library'
import { album } from '../controller/album'

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
.get('/search_music', async ctx => {
    const { query } = ctx.request
    const { q, pageNum = 0 } = query as { q: string, pageNum: number }
    ctx.body = await library.searchMusic(q, { pageNum })
})
.get('/music/:id', async ctx => {
    const { id } = ctx.params
    const { music, stream, size} = await library.getMusic(id) || {}
    if (music) {
        console.log('resp music file', music)
        ctx.set('content-type', 'audio/mpeg')
        ctx.set('Accept-Ranges', 'bytes')
        ctx.set('Content-Length', size)
        ctx.body = stream
    } else {
        ctx.throw(404, 'music not found')
    }
})
.delete('/music/:id', async ctx => {
    const { id } = ctx.params
    const status = await library.deleteMusic(id)
    ctx.body = { status }
})
.get('/album_list/:pageNum', async ctx => {
    const { pageNum } = ctx.params
    const { artist } = ctx.request.query
    ctx.body = await album.getAlbumList({pageNum, artist})
})
.get('/album/:id', async ctx => {
    const { id } = ctx.params
    const { needSongs } = ctx.request.query

    ctx.body = await album.getAlbum(id, { needSongs })
})
.get('/album_scan', async ctx => {
    album.createAlbumFromLibrary()
    ctx.body = { status: 'ok' }
})
.get('/album_cover/:albumId', async ctx => {
    const { albumId } = ctx.params
    ctx.set('content-type', 'image/jpeg')
    ctx.body = await album.getCover(albumId)
})

export { apiRoute }
