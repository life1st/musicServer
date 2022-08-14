export const excludeProps = <T>(obj: T, excludes: string[]): T => Object.keys(obj).reduce((acc, k) => {
  if (!excludes.includes(k)) {
      acc[k] = obj[k]
  }
  return acc;
}, {} as T)

export const filterExistProps = <T>(obj: T): T => Object.keys(obj).reduce((acc, k) => {
    if (obj[k]) {
        acc[k] = obj[k]
    }
    return acc
}, {} as T)