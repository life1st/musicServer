import Router from 'koa-router'
import { library } from '../controller/library'
import { album } from '../controller/album'
import { UPLOAD_TMP_DIR } from '../utils/path'
import { uploader } from '../utils/uploadUtil'
import { artistUtil } from '../utils/artists'

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
    ctx.set('Cache-Control', `max-age=${7 * 24 * 60 * 60}`) // sec
    ctx.body = await album.getCover(albumId)
}

fileRoute
.get('/music/:id', musicFileHandler)
.get('/album_cover/:albumId', albumCoverFileHandler)
.get('/artist_cover/:name', async ctx => {
    const { name } = ctx.params
    ctx.set('content-type', 'image/jpeg')
    ctx.set('Cache-Control', `max-age=${7 * 24 * 60 * 60}`) // sec
    ctx.body = artistUtil.getCover(name)
})
.post('/cover', async ctx => {
    let result
    try {
        result = await uploader({
            uploadFolder: UPLOAD_TMP_DIR,
            req: ctx.req
        })
    } catch (err) {
        result = err
    }
    ctx.body = result
})
export { fileRoute, musicFileHandler, albumCoverFileHandler }
