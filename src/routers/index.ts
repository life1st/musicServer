import Router from 'koa-router'
import { apiRoute  } from './api'
import { fileRoute } from './file'
import { authHandler } from '../utils/auth'

const route = new Router()

route
.use(authHandler)
.use('/api', apiRoute.routes(), apiRoute.allowedMethods())
.use('/file', fileRoute.routes(), fileRoute.allowedMethods())

export { route }
