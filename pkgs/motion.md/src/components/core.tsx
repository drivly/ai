import React from 'react'
import { LayoutProps } from './interfaces'

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
