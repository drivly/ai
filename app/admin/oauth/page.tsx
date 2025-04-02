'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function OAuthRedirect() {
  const router = useRouter()
  
  useEffect(() => {
    router.replace('/admin/oauth')
  }, [router])
  
  return (
    <div className="container mx-auto py-8 px-4">
      <p>Redirecting to the new OAuth admin page...</p>
    </div>
  )
}
