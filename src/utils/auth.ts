export const PW_CONST = 'fakepw'
export const MAX_AGE = 1000 * 60
export const MOST_EARLY = new Date('2022-8-25 19:50').getTime()


export const authHandler = async (ctx, next) => {
    const { url, cookie } = ctx
    const { pw, ts } = cookie

    if (
        !url.includes('/api/auth')
        && ((!pw && !ts) || pw !== PW_CONST || ts < MOST_EARLY || Date.now() - ts > MAX_AGE)
    ) {
        ctx.throw(403)
    } else {
        await next()
    }
}
