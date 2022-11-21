import Router from 'koa-router'
import { album } from '../../controller/album'
import { excludeProps } from '../../utils/obj'

const albumApiRoute = new Router()

albumApiRoute
.get('/album_scan', async ctx => {
  album.createAlbumFromLibrary()
  ctx.body = { status: 'ok' }
})
.get('/album_cover/:albumId', async ctx => {
  const { albumId } = ctx.params
  ctx.set('content-type', 'image/jpeg')
  ctx.body = await album.getCover(albumId)
})
.get('/album/:id', async ctx => {
  const { id } = ctx.params
  const { needSongs } = ctx.request.query

  ctx.body = await album.getAlbum(id, { needSongs })
})
.post('/album/:id', async ctx => {
  const { id } = ctx.params
  const { body } = ctx.request
  if (id !== body.albumId) {
    ctx.throw(403, 'albumId not match')
  } else {
    ctx.body = await album.updateAlbumBy({ album: excludeProps(body, ['songs']) })
  }
})
.get('/album_list/:pageNum', async ctx => {
  const { pageNum } = ctx.params
  const { artist } = ctx.request.query
  const albumlist = await album.getAlbumList({pageNum, artist})
  ctx.body = albumlist.map(album => excludeProps(album, ['_id', 'musicIds']))
})
.get('/search_album', async ctx => {
  const { query } = ctx.request
  const { q, pageNum = 0 } = query as { q: string, pageNum: number }
  const albumsByName = await album.getAlbumList({name: q, pageNum})
  const albumsByArtist =  await album.getAlbumList({artist: q, pageNum})
  const albums = [...albumsByName, ...albumsByArtist]
  ctx.body = albums.map(album => excludeProps(album, ['_id', 'musicIds'])).filter((_, i) => albums.findIndex(a => a.albumId) === i)
})

export { albumApiRoute }
