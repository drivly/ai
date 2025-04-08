'use client'

import React, { useEffect, useState, useRef } from 'react'
import Script from 'next/script'

export default function ReferenceAPIPage() {
  const [mounted, setMounted] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
    
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://unpkg.com/@stoplight/elements@9.0.1/styles.min.css'
    document.head.appendChild(link)
    
    const initializeApiViewer = () => {
      if (containerRef.current && window.customElements && window.customElements.get('elements-api')) {
        const apiElement = document.createElement('elements-api')
        apiElement.setAttribute('apiDescriptionUrl', '/api.json')
        apiElement.setAttribute('router', 'hash')
        apiElement.setAttribute('layout', 'sidebar')
        containerRef.current.innerHTML = ''
        containerRef.current.appendChild(apiElement)
      }
    }
    
    if (window.customElements && window.customElements.get('elements-api')) {
      initializeApiViewer()
    } else {
      window.addEventListener('WebComponentsReady', initializeApiViewer)
    }
    
    return () => {
      if (document.head.contains(link)) {
        document.head.removeChild(link)
      }
      window.removeEventListener('WebComponentsReady', initializeApiViewer)
    }
  }, [])

  if (!mounted) {
    return <div>Loading API documentation...</div>
  }

  return (
    <div className="stoplight-container">
      <h1>API Reference</h1>
      <Script 
        src="https://unpkg.com/@stoplight/elements@9.0.1/web-components.min.js"
        strategy="afterInteractive"
        onLoad={() => {
          window.dispatchEvent(new CustomEvent('WebComponentsReady'))
        }}
      />
      <div ref={containerRef} className="api-container">
        {/* API viewer will be mounted here */}
      </div>
      <style jsx global>{`
        .stoplight-container {
          width: 100%;
          height: 100vh;
          margin-top: 1rem;
        }
        .api-container {
          width: 100%;
          height: 100%;
        }
      `}</style>
    </div>
  )
}
