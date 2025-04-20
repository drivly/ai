'use client'

import { useEffect } from 'react'
import { signIn } from 'next-auth/react'

export default function LoginPage() {
  useEffect(() => {
    signIn('github', { callbackUrl: '/' })
  }, [])

  return (
    <div className="flex justify-center items-center h-dvh">
      <p className="text-lg">Redirecting to GitHub authentication...</p>
    </div>
  )
}
