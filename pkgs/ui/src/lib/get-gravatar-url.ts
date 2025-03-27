import { BinaryLike, createHash } from 'crypto'

export function md5Hash(data: BinaryLike) {
  return createHash('md5').update(data).digest('hex')
}
export const getGravatarUrl = (email?: string) => {
  if (!email) return null
  const hashedEmail = md5Hash(email)

  return `https://www.gravatar.com/avatar/${hashedEmail}??default=mp&r=g&s=50`
}
