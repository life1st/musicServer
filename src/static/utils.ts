let hasPermission = false

const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
const checkPermission = () => {
    return !hasPermission ? navigator.permissions.query({name: 'clipboard-write'}).then((r) => r.state === 'granted') : true
}

export const copyText = async (text) => {
    if (isSafari) {
        const temp = document.createElement("input")
        document.body.appendChild(temp)
        temp.value = text
        temp.select()
        document.execCommand("copy")
        temp.parentNode?.removeChild(temp)
    } else {
        const hasPermission = await checkPermission()
        if (hasPermission) {
            navigator.clipboard.writeText(text)
            return true
        }
        return false
    }
}
