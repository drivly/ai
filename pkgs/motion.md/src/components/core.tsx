'use client'

import React from 'react'
import { LayoutProps, SlideshowProps } from './interfaces'
// import { useVideoConfig } from 'remotion'

/**
 * Intro slide component
 */
export const Intro: React.FC<LayoutProps> = ({ children, title, subtitle, background, duration = 5, transition = 'fade' }) => {
  return (
    <div className='slide intro' style={{ background: background || '#000' }}>
      <div className='content'>
        {title && <h1 className='title'>{title}</h1>}
        {subtitle && <h2 className='subtitle'>{subtitle}</h2>}
        <div className='body'>{children}</div>
      </div>
    </div>
  )
}

/**
 * Cover slide component
 */
export const Cover: React.FC<LayoutProps> = ({ children, title, subtitle, background, duration = 5, transition = 'fade' }) => {
  return (
    <div className='slide cover' style={{ background: background || '#111' }}>
      <div className='content'>
        {title && <h1 className='title'>{title}</h1>}
        {subtitle && <h2 className='subtitle'>{subtitle}</h2>}
        <div className='body'>{children}</div>
      </div>
    </div>
  )
}

/**
 * Default slide component
 */
export const Default: React.FC<LayoutProps> = ({ children, title, subtitle, background, duration = 5, transition = 'fade' }) => {
  return (
    <div className='slide default' style={{ background: background || '#222' }}>
      <div className='content'>
        {title && <h1 className='title'>{title}</h1>}
        {subtitle && <h2 className='subtitle'>{subtitle}</h2>}
        <div className='body'>{children}</div>
      </div>
    </div>
  )
}

/**
 * Slideshow component for code animations
 */
export const Slideshow: React.FC<SlideshowProps> = ({ children, title, code, steps, language, background, duration = 5, transition = 'fade' }) => {
  const stepDuration = steps && steps.length > 0 ? duration / steps.length : duration

  // const { fps } = useVideoConfig();
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
          }}>
          <pre style={{ margin: 0 }}>
            <code
              className={`language-${language || 'typescript'}`}
              style={{
                fontFamily: 'monospace',
                color: '#d4d4d4',
              }}>
              {/* In server rendering, we can't use state, so just show the first step or code */}
              {steps && steps.length > 0 ? steps[0] : code}
            </code>
          </pre>
        </div>
        <div className='body'>{children}</div>
      </div>
    </div>
  )
}
