export const cn = (...classes) => classes.filter(Boolean).join(' ')
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
export const getGravatarUrl = (email = '') => {
  return `https://www.gravatar.com/avatar/placeholder?d=mp`
}
