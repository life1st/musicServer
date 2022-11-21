export const darkModeConfig = {
  brightness: 100,
  contrast: 90,
  sepia: 0,
}

const localKey = '__auto_set_system_color__'
export const autoDarkModeUtils = {
  getEnabled() {
    const result = localStorage.getItem(localKey) || ''
    if (!['0', '1'].includes(result)) {
      // if unset, open by default
      autoDarkModeUtils.setEnable(true)
      return true
    }
    return result === '1'
  },
  setEnable(isEnable: boolean) {
    localStorage.setItem(localKey, isEnable ? '1' : '0')
  }
}
