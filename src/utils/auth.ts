export const PW_CONST = 'fakepw'
export const MAX_AGE = 1000 * 60 * 60 * 24 * 7 // days
export const MOST_EARLY = new Date('2022-8-25 19:50').getTime()

export const checkAuthed = (ctx): boolean => {
    const { url, cookie, method } = ctx
    const { pw, ts } = cookie || {}

    const isPost = method.toLowerCase() === 'post'
    const isPubPath = url.includes('/api/auth') && isPost

    if (
        !isPubPath && ((!pw && !ts) || pw !== PW_CONST || ts < MOST_EARLY || Date.now() - ts > MAX_AGE)
    ) {
        return false
    }
    return true
}

export const authHandler = async (ctx, next) => {
    const pass = checkAuthed(ctx)
    if (pass) {
        await next()
    } else {
        ctx.throw(403)
    }    
}
