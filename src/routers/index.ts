import Router from 'koa-router'
import { apiRoute  } from './api'
import { fileRouter } from './file'

const route = new Router()

route
.use('/api', apiRoute.routes(), apiRoute.allowedMethods())
.use('/file', fileRouter.routes(), fileRouter.allowedMethods())

export { route }
