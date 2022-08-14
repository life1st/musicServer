import Router from 'koa-router'
import { library } from '../controller/library'
import { album } from '../controller/album'

const fileRoute = new Router()

const musicFileHandler = async ctx => {
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
}

const albumCoverFileHandler = async ctx => {
    const { albumId } = ctx.params
    ctx.set('content-type', 'image/jpeg')
    ctx.body = await album.getCover(albumId)
}

fileRoute
.get('/music/:id', musicFileHandler)
.get('/album_cover/:albumId', albumCoverFileHandler)

export { fileRoute, musicFileHandler, albumCoverFileHandler }
