'use client'

import { createAuthClient } from 'better-auth/react'

export default function LoginRedirect() {
  const authClient = createAuthClient({})

  authClient.signIn.social({
    provider: 'github',
    callbackURL: '/admin',
  })

  return <div className="hidden">Redirecting to GitHub...</div>
}
