'use client'

import { ReactNode } from 'react'

/**
 * Base props for all components
 */
export interface BaseComponentProps {
  children?: ReactNode
  duration?: number
  transition?: string
}

/**
 * Props for layout components
 */
export interface LayoutProps extends BaseComponentProps {
  title?: string
  subtitle?: string
  background?: string
}

/**
 * Props for slideshow layout component
 */
export interface SlideshowProps extends LayoutProps {
  code: string
  steps: string[]
  language?: string
}

/**
 * Props for media components
 */
export interface MediaProps extends BaseComponentProps {
  src?: string
  alt?: string
  width?: number
  height?: number
}

/**
 * Props for voiceover component
 */
export interface VoiceoverProps {
  text: string
  voice?: string
}
