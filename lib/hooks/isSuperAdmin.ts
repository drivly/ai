import { Access } from 'payload'
import type { User } from '@/payload.types'

const superAdminEmails = process.env.SUPER_ADMIN_EMAILS?.split(',') ?? []

export function isSuperAdmin(user: unknown) {
  if (!user) return false

  const typedUser = user as User

  const userRoles = (typedUser as any).roles
  if (userRoles && Array.isArray(userRoles)) {
    if (userRoles.some((role: any) => typeof role === 'object' && role.superAdmin)) {
      return true
    }
  }

  if (typedUser.email.endsWith('@driv.ly')) {
    return true
  }

  return superAdminEmails.some((email) => email === typedUser.email)
}

export const isSuperAdminAccess: Access = ({ req }): boolean => {
  return isSuperAdmin(req.user)
}

// add SUPER_ADMIN_EMAILS to .env
// nateclev@gmail.com
