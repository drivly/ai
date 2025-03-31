import { md5 } from 'js-md5'

export const getGravatarUrl = (email?: string) => {
  if (!email) return null

  // Normalize the email and create MD5 hash
  const normalizedEmail = email.trim().toLowerCase()
  const hashedEmail = md5(normalizedEmail)

  return `https://www.gravatar.com/avatar/${hashedEmail}?default=mp&r=g&s=50`
}
