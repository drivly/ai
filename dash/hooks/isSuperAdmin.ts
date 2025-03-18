import { Access } from 'payload'
import type { User } from '@/payload-types'

export function isSuperAdmin(user: unknown) {
  return (user as User)?.email?.endsWith('@driv.ly') ?? false
}

export const isSuperAdminAccess: Access = ({ req }): boolean => {
  return isSuperAdmin(req.user)
}
