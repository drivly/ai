'use client'

import React, { useEffect, useState, useRef } from 'react'
import Script from 'next/script'
import { useTheme } from 'next-themes'

export function StoplightAPIViewer() {
  const [mounted, setMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const { resolvedTheme } = useTheme()
  const isDarkMode = resolvedTheme === 'dark'

  useEffect(() => {
    setMounted(true)
    
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      
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
        document.body.style.overflow = ''
        if (document.head.contains(link)) {
          document.head.removeChild(link)
        }
        window.removeEventListener('WebComponentsReady', initializeApiViewer)
      }
    }
  }, [isOpen])

  if (!mounted) {
    return null
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="api-button"
      >
        Open API Reference
      </button>
      
      {isOpen && (
        <div className="api-popover-overlay">
          <div className="api-popover">
            <div className="api-popover-header">
              <h2>API Reference</h2>
              <button 
                onClick={() => setIsOpen(false)}
                className="api-close-button"
                aria-label="Close API Reference"
              >
                ×
              </button>
            </div>
            <div className="api-popover-content">
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
            </div>
          </div>
          
          <style jsx global>{`
            .api-button {
              display: inline-flex;
              align-items: center;
              justify-content: center;
              padding: 0.5rem 1rem;
              font-size: 1rem;
              font-weight: 500;
              border-radius: 0.375rem;
              background-color: var(--nextra-primary-hue);
              color: white;
              cursor: pointer;
              border: none;
              transition: background-color 0.2s;
            }
            
            .api-button:hover {
              background-color: var(--nextra-primary-hue-dark);
            }
            
            .api-popover-overlay {
              position: fixed;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background-color: rgba(0, 0, 0, 0.5);
              display: flex;
              align-items: center;
              justify-content: center;
              z-index: 9999;
            }
            
            .api-popover {
              width: 95vw;
              height: 95vh;
              background-color: ${isDarkMode ? '#1a1a1a' : 'white'};
              border-radius: 0.5rem;
              box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
              display: flex;
              flex-direction: column;
              overflow: hidden;
            }
            
            .api-popover-header {
              display: flex;
              align-items: center;
              justify-content: space-between;
              padding: 1rem;
              border-bottom: 1px solid ${isDarkMode ? '#333' : '#e5e7eb'};
            }
            
            .api-popover-header h2 {
              margin: 0;
              font-size: 1.25rem;
              font-weight: 600;
              color: ${isDarkMode ? 'white' : 'inherit'};
            }
            
            .api-close-button {
              background: transparent;
              border: none;
              font-size: 1.5rem;
              line-height: 1;
              padding: 0.25rem;
              cursor: pointer;
              color: ${isDarkMode ? 'white' : '#6b7280'};
            }
            
            .api-close-button:hover {
              color: ${isDarkMode ? '#d1d5db' : '#111827'};
            }
            
            .api-popover-content {
              flex: 1;
              overflow: auto;
              padding: 0;
            }
            
            .api-container {
              width: 100%;
              height: 100%;
            }
            
            /* Dark mode overrides for Stoplight Elements */
            ${isDarkMode ? `
              .api-container elements-api {
                --theme-bg: #1a1a1a;
                --theme-bg-offset: #262626;
                --theme-text: #e5e7eb;
                --theme-text-light: #d1d5db;
                --theme-text-lighter: #9ca3af;
                --theme-border: #333;
                --theme-border-light: #4b5563;
                --theme-primary: var(--nextra-primary-hue);
              }
            ` : ''}
          `}</style>
        </div>
      )}
    </>
  )
}

export default StoplightAPIViewer
