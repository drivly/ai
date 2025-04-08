'use client'

import React from 'react'
import dynamic from 'next/dynamic'

const APIViewer = dynamic(
  () => import('@stoplight/elements').then((mod) => mod.API),
  { ssr: false }
)

export default function ReferenceAPIPage() {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
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
    return <div>Loading API documentation...</div>
  }

  return (
    <div className="stoplight-container">
      <h1>API Reference</h1>
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
