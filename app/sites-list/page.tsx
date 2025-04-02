'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import React from 'react'

export default function SitesListRedirect() {
  const router = useRouter()
  
  useEffect(() => {
    router.replace('/sites-list')
  }, [router])
  
  return <div className="container mx-auto px-4 pt-20 pb-12">Loading sites list...</div>
}
