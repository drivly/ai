'use client'

import { useEffect } from 'react'

export default function APIReference() {
  useEffect(() => {
    window.open('https://apis.do/reference', '_blank')
    window.history.back()
  }, [])
  
  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Redirecting to API Reference...</p>
    </div>
  )
}
