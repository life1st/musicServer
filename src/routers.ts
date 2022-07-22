import Router from 'koa-router'

const route = new Router()

route.get('/', async (ctx, next) => {
    ctx.body = 'Hello World'
})

export { route }
