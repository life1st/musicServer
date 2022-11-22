import { 
  auto as followSystemColorScheme,
  enable as enableDarkMode,
} from 'darkreader'


export const darkModeConfig = {
  brightness: 100,
  contrast: 90,
  sepia: 0,
}

const autoDarkKey = '__auto_set_system_color__'
const isUsingDarkKey = '__is_using_dark_mode__'
export const autoDarkModeUtils = {
  getEnabledAuto() {
    const result = localStorage.getItem(autoDarkKey) || ''
    if (!['0', '1'].includes(result)) {
      // if unset, open by default
      autoDarkModeUtils.setEnable(true)
      return true
    }
    return result === '1'
  },
  setEnable(isEnable: boolean) {
    localStorage.setItem(autoDarkKey, isEnable ? '1' : '0')
  },
  isUsingDark() {
    return localStorage.getItem(isUsingDarkKey) === '1'
  },
  setIsUsingDark(isUsingDark: boolean) {
    localStorage.setItem(isUsingDarkKey, isUsingDark ? '1' : '0')
  }
}

export const darkModeSupport = () => {
  const autoEnableDarkMode = autoDarkModeUtils.getEnabledAuto()
  if (autoEnableDarkMode) {
      followSystemColorScheme(darkModeConfig) // enable auto darkmode
  } else if (autoDarkModeUtils.isUsingDark()) { // auto disabled, use saved setting.
      enableDarkMode(darkModeConfig)
  }
}
