'use client'

import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

const APIViewer = dynamic(
  () => import('@stoplight/elements').then((mod) => mod.API),
  { ssr: false }
)

export function StoplightAPIViewer() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://unpkg.com/@stoplight/elements@9.0.1/styles.min.css'
    document.head.appendChild(link)
    
    return () => {
      document.head.removeChild(link)
    }
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="stoplight-container">
      <APIViewer apiDescriptionUrl="/api.json" />
      <style jsx global>{`
        .stoplight-container {
          width: 100%;
          height: 100vh;
          margin-top: 1rem;
        }
      `}</style>
    </div>
  )
}

export default StoplightAPIViewer
