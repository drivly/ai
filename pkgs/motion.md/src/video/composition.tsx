'use client'

import React from 'react'
import { Composition, AbsoluteFill, useVideoConfig } from 'remotion'
import { VideoConfig, Slide } from '../types'
import { Intro, Cover, Default, Slideshow } from '../components/core'

interface MotionCompositionProps {
  slides: Slide[]
  config: VideoConfig
}

/**
 * Main component that renders a slide
 */
const SlideRenderer: React.FC<{ slide: Slide; config: VideoConfig }> = ({ slide, config }) => {
  const layout = slide.layout || 'default'

  const { content, background, voiceover, transition, duration = config.duration || 5 } = slide

  const commonProps = {
    background,
    duration,
    transition: transition || config.transition,
  }

  switch (layout.toLowerCase()) {
    case 'intro':
      return (
        <Intro {...commonProps}>
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </Intro>
      )
    case 'cover':
      return (
        <Cover {...commonProps}>
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </Cover>
      )
    case 'slideshow':
      const { code, steps, language } = slide as any;
      return (
        <Slideshow 
          {...commonProps}
          code={code || ''}
          steps={steps || []}
          language={language || 'typescript'}
        >
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </Slideshow>
      )
    default:
      return (
        <Default {...commonProps}>
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </Default>
      )
  }
}

/**
 * Main composition component
 */
export const MotionComposition: React.FC<MotionCompositionProps> = ({ slides, config }) => {
  const { width, height, fps } = useVideoConfig()

  const totalDuration = slides.reduce((total, slide) => {
    return total + (slide.duration || config.duration || 5) * fps
  }, 0)

  return (
    <AbsoluteFill style={{ backgroundColor: 'white' }}>
      {slides.map((slide, index) => (
        <SlideRenderer key={index} slide={slide} config={config} />
      ))}
    </AbsoluteFill>
  )
}

/**
 * Root component for Remotion
 */
export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id='MotionComposition'
      component={MotionComposition}
      durationInFrames={300}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{
        slides: [],
        config: {
          title: 'Default Composition',
          output: 'output.mp4',
          fps: 30,
          resolution: { width: 1920, height: 1080 },
          transition: 'fade',
        },
      }}
    />
  )
}
