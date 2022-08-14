import Router from 'koa-router'
import { library } from '../../controller/library'
import { musicFileHandler } from '../file'

const libraryApiRoute = new Router()

libraryApiRoute
.post('/scan', async ctx => {
  try {
    const [scanning, finishCount] = await library.scan(ctx.body)
    ctx.body = { isScan: true, waiting: scanning.slice(0, 10), finishCount }
  } catch (e) {
      ctx.throw(500, { isScan: false, e })
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
.delete('/music/:id', async ctx => {
  const { id } = ctx.params
  const status = await library.deleteMusic(id)
  ctx.body = { status }
})
.get('/music/:id', musicFileHandler)

export { libraryApiRoute }