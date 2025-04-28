export const slugify = (str: string) => {
  return str.replace(/\s+/g, '_').replaceAll('/', '')
}
