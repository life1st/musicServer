import Router from 'koa-router'
import { artistUtil } from '../../utils/artists'

const artistsApiRoute = new Router()

artistsApiRoute
.get('/artists', async ctx => {
  ctx.body = artistUtil.getArtists()
})
.post('/artists/scan', async ctx => {
  artistUtil.scan()
  ctx.body = { status: true }
})
.post('/artist/:name', async ctx => {
  const { name } = ctx.params
  const { covername } = ctx.request.body || {}
  const result = await artistUtil.updateArtist({ name: decodeURIComponent(name), covername })
  ctx.body = { status: result }
})
.delete('/artist/:name', async ctx => {
  const { name } = ctx.params
  console.log(name)
  artistUtil.deleteArtist({ name })
  ctx.body = { status: true }
})

export { artistsApiRoute }