'use client'

import { syncLogoutToDomains } from '@/lib/auth/utils'
import { signOut } from 'next-auth/react'
import { useCallback } from 'react'

export function LogoutButton({ children }: { children: React.ReactNode }) {
  const handleLogout = useCallback(async () => {
    await syncLogoutToDomains()
    await signOut({ callbackUrl: '/' })
  }, [])

  return <button onClick={handleLogout}>{children}</button>
}
