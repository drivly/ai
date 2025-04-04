import { Access } from 'payload'
import type { User } from '@/payload.types'

export function isSuperAdmin(user: unknown) {
  if (!user) return false
  
  const typedUser = user as User
  
  if (typedUser.roles?.some(role => typeof role === 'object' && role.superAdmin)) {
    return true
  }
  
  return typedUser?.email?.endsWith('@driv.ly') ?? false
}

export const isSuperAdminAccess: Access = ({ req }): boolean => {
  return isSuperAdmin(req.user)
}
