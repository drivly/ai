import { bundle, renderMedia, selectComposition } from 'remotion'
import { VideoGenerationOptions, VideoResult } from '../types'
import path from 'path'

/**
 * Generate video from slides using Remotion
 */
export async function createVideoFromSlides({
  slides,
  config,
  outputPath,
  options = {}
}: VideoGenerationOptions): Promise<VideoResult> {
  const defaultOptions = {
    tts: true,
    quality: 'production' as const,
  }
  
  const mergedOptions = { ...defaultOptions, ...options }
  
  const compositionPath = require.resolve('./composition')
  
  const bundleResult = await bundle({
    entryPoint: compositionPath,
    webpackOverride: (config: any) => {
      return {
        ...config,
        externals: {
          ...config.externals,
        },
      }
    },
  })
  
  const composition = await selectComposition({
    serveUrl: bundleResult.serveUrl,
    id: 'MotionComposition',
    inputProps: {
      slides,
      config,
    },
  })
  
  const renderResult = await renderMedia({
    composition,
    serveUrl: bundleResult.serveUrl,
    codec: 'h264',
    outputLocation: outputPath,
    inputProps: {
      slides,
      config,
    },
    imageFormat: 'jpeg',
    quality: mergedOptions.quality === 'production' ? 100 : 50,
    fps: config.fps,
    dumpBrowserLogs: true,
  })
  
  return {
    success: true,
    outputPath,
    duration: composition.durationInFrames / config.fps,
    size: renderResult.sizeInBytes,
  }
}
