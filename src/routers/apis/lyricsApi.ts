import Router from 'koa-router'
import lyrics from '../../controller/lyrics'

const lyricsApiRoute = new Router()
lyricsApiRoute
.get('/lyrics', async ctx => {
  ctx.body = 'hello from lyrics'
})
.get('/lyrics/search', async ctx => {
  const { query } = ctx.request
  const { name, artist } = query as { name: string, artist?: string }
  const data = await lyrics.getLyricsBy({name, artist})
  console.log('data', data)
  ctx.body = data || 'no result'
})
.get('/lyric/:id',async ctx => {
  const { id } = ctx.params
  ctx.body = await lyrics.getLyricsBy({ musicId: id })
})

export { lyricsApiRoute }