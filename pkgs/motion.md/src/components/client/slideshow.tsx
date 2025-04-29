'use client'

import React from 'react'
import { SlideshowProps } from '../interfaces'

/**
 * Client-side Slideshow component for interactive animations
 */
export const SlideshowClient: React.FC<SlideshowProps> = ({ children, title, code, steps, language, background, duration = 5, transition = 'fade' }) => {
  const stepDuration = steps && steps.length > 0 ? duration / steps.length : duration
  const [currentStep, setCurrentStep] = React.useState(0)

  React.useEffect(() => {
    if (!steps || steps.length <= 1) return

    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length)
    }, stepDuration * 1000)

    return () => clearInterval(interval)
  }, [steps, stepDuration])

  return (
    <div className='slide slideshow' style={{ background: background || '#222' }}>
      <div className='content'>
        {title && <h1 className='title'>{title}</h1>}
        <div
          className='code-container'
          style={{
            backgroundColor: '#1e1e1e',
            borderRadius: '4px',
            padding: '16px',
            overflow: 'auto',
            maxWidth: '100%',
          }}
        >
          <pre style={{ margin: 0 }}>
            <code
              className={`language-${language || 'typescript'}`}
              style={{
                fontFamily: 'monospace',
                color: '#d4d4d4',
              }}
            >
              {steps && steps.length > 0 ? steps[currentStep] : code}
            </code>
          </pre>
        </div>
        <div className='body'>{children}</div>
      </div>
    </div>
  )
}
