import Router from 'koa-router'
import { apiRoute  } from './api'
import { fileRoute } from './file'

const route = new Router()

route
.use('/api', apiRoute.routes(), apiRoute.allowedMethods())
.use('/file', fileRoute.routes(), fileRoute.allowedMethods())

export { route }
