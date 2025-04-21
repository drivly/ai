'use client'

import { Root } from 'mdast'

export interface VideoConfig {
  title: string
  output: string
  fps: number
  resolution: { width: number; height: number }
  transition?: string
  duration?: number
  theme?: string
}

export interface Slide {
  content: string
  layout?: string
  background?: string
  voiceover?: string
  transition?: string
  duration?: number
  mdast?: Root
  code?: string
  steps?: string[]
  language?: string
}

export interface VideoGenerationOptions {
  slides: Slide[]
  config: VideoConfig
  outputPath: string
  options?: {
    tts?: boolean
    quality?: 'draft' | 'production'
    [key: string]: any
  }
}

export interface VideoResult {
  success: boolean
  outputPath: string
  duration: number
  size: number
}
