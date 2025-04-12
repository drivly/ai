import { api } from 'apis.do'

/**
 * Video generation service
 */
export const videoGeneration = {
  /**
   * Generate visual assets from script sections
   * @param options - Visual generation options
   * @returns Generated visual assets
   */
  createVisuals: async (options: {
    script: any,
    style?: 'corporate' | 'casual' | 'educational' | 'minimalist',
    transitions?: boolean,
    brandColors?: string[]
  }): Promise<{
    slides: Array<{
      id: string,
      imageUrl: string,
      duration: number
    }>,
    transitionUrls?: string[]
  }> => {
    return api.post('/videoGeneration/visuals', options)
  },
  
  /**
   * Render a complete video with visuals and audio
   * @param options - Video rendering options
   * @returns Rendered video details
   */
  renderVideo: async (options: {
    visuals: any,
    audio: any,
    outputFormat?: 'mp4' | 'mov' | 'webm',
    resolution?: '720p' | '1080p' | '4k',
    fps?: number
  }): Promise<string> => {
    return api.post('/videoGeneration/render', options)
  },
  
  /**
   * Map speech to appropriate visuals
   * @param options - Speech to visuals mapping options
   * @returns Synchronization data
   */
  speechToVisuals: async (options: {
    speechText: string,
    speechAudio: string,
    visuals: any
  }): Promise<{
    timings: Array<{
      visualId: string,
      startTime: number,
      endTime: number
    }>
  }> => {
    return api.post('/videoGeneration/sync', options)
  }
}
