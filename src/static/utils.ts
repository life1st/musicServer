let hasPermission = false
const checkPermission = () => {
    return !hasPermission ? navigator.permissions.query({name: 'clipboard-write'}).then((r) => r.state === 'granted') : true
}

export const copyText = async (text) => {
    const hasPermission = await checkPermission()
    if (hasPermission) {
        navigator.clipboard.writeText(text)
        return true
    }
    return false
}
