'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function OAuthRedirect() {
  const router = useRouter()
  
  useEffect(() => {
    router.replace('/admin/oauth/providers')
  }, [router])
  
  return (
    <div className="container mx-auto py-8 px-4">
      <p>Redirecting to the new OAuth providers page...</p>
    </div>
  )
}
