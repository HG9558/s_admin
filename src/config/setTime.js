export function setTime (time) {
  if (!time) return ''
  if (time.length > 19) return time.slice(0, 19)
  return time
}