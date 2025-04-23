'use client'

import React from 'react'
import { MediaProps, VoiceoverProps } from './interfaces'

/**
 * Image component for displaying images in slides
 */
export const Image: React.FC<MediaProps> = ({ src, alt, width, height, duration = 5, transition = 'fade' }) => {
  return (
    <img
      src={src}
      alt={alt || 'Slide image'}
      style={{
        width: width ? `${width}px` : '100%',
        height: height ? `${height}px` : 'auto',
      }}
    />
  )
}

/**
 * Video component for embedding videos in slides
 */
export const Video: React.FC<MediaProps> = ({ src, width, height, duration = 5, transition = 'fade' }) => {
  return (
    <video
      src={src}
      style={{
        width: width ? `${width}px` : '100%',
        height: height ? `${height}px` : 'auto',
      }}
      autoPlay
      muted
    />
  )
}

/**
 * Browser component for displaying browser screenshots
 */
export const Browser: React.FC<MediaProps & { url?: string }> = ({ src, url, width, height, duration = 5, transition = 'fade' }) => {
  return (
    <div className='browser-frame' style={{ width: width ? `${width}px` : '100%' }}>
      <div className='browser-header'>
        <div className='browser-controls'>
          <span className='browser-control red'></span>
          <span className='browser-control yellow'></span>
          <span className='browser-control green'></span>
        </div>
        <div className='browser-address-bar'>{url || 'https://example.com'}</div>
      </div>
      <div className='browser-content' style={{ height: height ? `${height}px` : '600px' }}>
        <img src={src} alt='Browser screenshot' style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
    </div>
  )
}

/**
 * Voiceover component for adding narration to slides
 * This is a non-visual component that will be processed during video generation
 */
export const Voiceover: React.FC<VoiceoverProps> = ({ text, voice }) => {
  return null
}
