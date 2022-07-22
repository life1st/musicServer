import Router from 'koa-router'
import { library } from '../controller/library'

const apiRoute = new Router()

apiRoute.get('/scan', async ctx => {
    const status = library.scan()
    
    ctx.body = { isScran: status }
})

export { apiRoute }
