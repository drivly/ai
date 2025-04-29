import { renderMedia, RenderMediaOnProgress, getCompositions } from '@remotion/renderer'
import { VideoGenerationOptions, VideoResult } from '../types'
import path from 'path'

/**
 * Generate video from slides using Remotion
 */
export async function createVideoFromSlides({ slides, config, outputPath, options = {} }: VideoGenerationOptions): Promise<VideoResult> {
  const defaultOptions = {
    tts: true,
    quality: 'production' as const,
  }

  const mergedOptions = { ...defaultOptions, ...options }

  const compositionPath = path.resolve(path.dirname(new URL(import.meta.url).pathname), 'composition.mjs')
  const compositions = await getCompositions(compositionPath)

  const composition = compositions.find((comp: { id: string }) => comp.id === 'MotionComposition')

  if (!composition) {
    throw new Error('Could not find composition with id "MotionComposition"')
  }

  const onProgress: RenderMediaOnProgress = ({ progress }: { progress: number }) => {
    console.log(`Rendering progress: ${Math.floor(progress * 100)}%`)
  }

  const renderResult = await renderMedia({
    composition,
    codec: 'h264',
    outputLocation: outputPath,
    inputProps: {
      slides,
      config,
    },
    imageFormat: 'jpeg',
    jpegQuality: mergedOptions.quality === 'production' ? 100 : 50,
    onProgress,
    serveUrl: 'http://localhost:3000',
  })

  return {
    success: true,
    outputPath,
    duration: composition.durationInFrames / (config.fps || 30),
    size: 0, // Size information not available in Remotion v4 API
  }
}
