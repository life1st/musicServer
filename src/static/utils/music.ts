export const parseTrackNumber = (tn) => {
  if (!tn) {
    return 0
  }
  if (!Number.isNaN(Number(tn))) {
    return Number(tn)
  }
  if (tn.includes('/')) {
    return Number(tn.split('/')[0])
  }
}
