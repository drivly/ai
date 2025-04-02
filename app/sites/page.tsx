'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import React from 'react'

export default function SitesRedirect() {
  const router = useRouter()
  
  useEffect(() => {
    router.push('/sites')
  }, [router])
  
  return <div className="container mx-auto px-4 pt-20 pb-12">Redirecting to sites list...</div>
}
