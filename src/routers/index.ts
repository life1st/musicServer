import Router from 'koa-router'
import { apiRoute  } from './api'

const route = new Router()

route
.get('/api', apiRoute.routers(), apiRoute.allowedMethods())

export { route }
