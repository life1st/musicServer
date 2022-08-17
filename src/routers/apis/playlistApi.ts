import Router from 'koa-router'
import { playlist } from '../../controller/playlist'

const playlistRoute = new Router()

playlistRoute
.get('/playlists', async ctx => {
    const { page, limit } = ctx.query
    ctx.body = await playlist.getPlaylists({page, limit})
})
.get('/playlist/:id', async ctx => {
    const { id } = ctx.params
    const list = await playlist.getPlaylist(id)
    ctx.body = list
})
.post('/playlist', async ctx => {
    const { body } = ctx.request
    const list = await playlist.createPlaylist(body)
    ctx.body = list
})
.post('/playlist/:id', async ctx => {
    const { id } = ctx.params
    const { body } = ctx.request
    const isUpdate = await playlist.updatePlaylist(id, body)
    ctx.body = {isUpdate}
})
.delete('/playlist/:id', async ctx => {
    const { id } = ctx.params
    const isDelete = await playlist.deletePlaylist(id)
    ctx.body = {isDelete}
})
const playlistApiRoute = playlistRoute
export { playlistApiRoute }
