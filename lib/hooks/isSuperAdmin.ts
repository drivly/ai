import { Access } from 'payload'
import type { User } from '@/payload.types'

export function isSuperAdmin(user: unknown) {
  if (!user) return false
  
  const typedUser = user as User
  
  const userRoles = (typedUser as any).roles
  if (userRoles && Array.isArray(userRoles)) {
    if (userRoles.some((role: any) => typeof role === 'object' && role.superAdmin)) {
      return true
    }
  }
  
  return typedUser?.email?.endsWith('@driv.ly') ?? false
}

export const isSuperAdminAccess: Access = ({ req }): boolean => {
  return isSuperAdmin(req.user)
}
