export const colorStr2rgbaArr = (str) => {
  if (str.includes('rgba')) {
    str = str.replace('rgba(', '').replace(')', '')
    return str.split(',')
  }
  if (str.includes('rgb')) {
    str = str.replace('rgb(', '').replace(')', '')
    return str.split(',')
  }

  console.error('parse error, invalid rgb | rgba color string:', str)
  return null
}

export const genColorStrByrgbaArr = (arr) => {
  if (arr.length === 3) {
    return `rgb(${arr.join(',')})`
  }
  if (arr.length === 4) {
    return `rgba(${arr.join(',')})`
  }

  console.error('provide array length not like colors:', arr)
  return null
}

export const genColorStrByColors = (colorArr1, colorArr2): string => {
  const color = colorArr1.map((c, i) => c + colorArr2[i])
  return genColorStrByrgbaArr(color) || ''
}
