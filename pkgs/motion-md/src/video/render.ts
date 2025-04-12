import { bundle } from '@remotion/bundler'
import { renderMedia, selectComposition } from '@remotion/renderer'
import { VideoGenerationOptions, VideoResult } from '../types'

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
  
  const bundleResult = await bundle({
    entryPoint: require.resolve('./composition'),
    webpackOverride: (config) => {
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
