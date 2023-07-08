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
  const color = colorArr1.map((c, i) => Number(c) + Number(colorArr2[i]))
  return genColorStrByrgbaArr(color) || ''
}

export const getImgThemeColors = (imgNode) => {
  const { width, height } = imgNode
  const canvasCls = 'img_theme_colors'
  const w = 24
  const h = Math.floor(height * width / w)
  let canvas = document.querySelector(canvasCls)
  if (!canvas) {
    canvas = document.createElement('canvas')
    canvas.width = w * window.devicePixelRatio
    canvas.height = h * window.devicePixelRatio
    canvas.className = canvasCls
    canvas.style.cssText = `
      position: absolute;
      top: -10000px;
      left: -10000px;
      width: ${w}px;
      height: ${h}px;
    `
    document.body.appendChild(canvas)
  }
  const ctx = canvas.getContext('2d')
  ctx.drawImage(imgNode, 0, 0, w, h)

  const pixels: any[] = []
  for (let x = 0; x < w; x++) {
      for (let y = 0; y < h; y++) {
          const pixel = ctx.getImageData(x, y, 1, 1).data
          pixels.push(pixel)
      }
  }
  const rgbRange = 42
  const reducedPixels = []
  const reducePCount = {}
  const calcRange = (c1, c2) => Math.abs(c1 - c2) < rgbRange
  pixels.forEach((p) => {
      const [r, g, b, o] = p
      if ([r, g, b].every(c => c > 240 || c < 15)) {
          return // filter edge color.
      }
      if (reducedPixels.length === 0 || 
          reducedPixels.every((rp, i) => {
          const [rr, rg, rb, ro] = Array.from(rp)
          const rsame = calcRange(rr, r)
          const gsame = calcRange(rg, g)
          const bsame = calcRange(rb, b)
          const rgbSame = rsame && gsame && bsame
          if (rgbSame) {
              if (!reducePCount[i]) {
                  reducePCount[i] = 1
              } else {
                  reducePCount[i]++
              }
          }
          return !rgbSame
      })) {
          reducedPixels.push(p)
      }
  })
  const indexSort = Object.keys(reducePCount).sort((a, b) => reducePCount[a] - reducePCount[b])
  const sortedReducedPixels = indexSort.map(index => reducedPixels[index])

  return sortedReducedPixels
}
