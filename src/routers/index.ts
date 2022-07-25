import Router from 'koa-router'
import { apiRoute  } from './api'

const route = new Router()

route
.use('/api', apiRoute.routes(), apiRoute.allowedMethods())

export { route }
