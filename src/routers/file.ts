import Router from 'koa-router'
import { library } from '../controller/library'
import { album } from '../controller/album'

const fileRoute = new Router()

fileRoute
.get('/music/:id', async ctx => {
    const { id } = ctx.params
    const { music, stream, size} = await library.getMusic(id)
    console.log('resp music file', music)
    ctx.set('content-type', 'audio/mpeg')
    ctx.set('Accept-Ranges', 'bytes')
    ctx.set('Content-Length', size)
    ctx.body = stream
})
.get('/album_cover/:albumId', async ctx => {
    const { albumId } = ctx.params
    ctx.set('content-type', 'image/jpeg')
    ctx.body = await album.getCover(albumId)
})

export { fileRoute }
