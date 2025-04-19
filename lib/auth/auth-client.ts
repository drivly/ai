'use client'

import { useSession as useNextAuthSession, signIn as nextAuthSignIn, signOut as nextAuthSignOut } from "next-auth/react"
import { toast } from 'sonner'

export const signIn = nextAuthSignIn
export const signOut = nextAuthSignOut

export function useSession() {
  const { data: session, status, update } = useNextAuthSession()
  
  return {
    session,
    status,
    update,
    isLoading: status === 'loading',
    isAuthenticated: status === 'authenticated',
    user: session?.user,
  }
}

export function useHasRole(role: string | string[]) {
  const { user } = useSession()
  
  if (!user) return false
  
  if (Array.isArray(role)) {
    return role.includes(user.role as string)
  }
  
  return user.role === role
}

export const useActiveOrganization = () => ({ organization: null })
export const useListOrganizations = () => ({ organizations: [] })
export const organization = {
  create: async () => ({}),
  update: async () => ({}),
  delete: async () => ({}),
  invite: async () => ({}),
}

export const handleApiError = (e: any) => {
  if (e?.status === 429) {
    toast.error('Too many requests. Please try again later.')
  }
}
