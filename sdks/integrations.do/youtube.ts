import { api } from 'apis.do'

/**
 * YouTube API client
 */
export const youtube = {
  /**
   * Upload a video to YouTube
   * @param options - Video upload options
   * @returns Published video details
   */
  uploadVideo: async (options: {
    videoFile: string | Buffer, 
    title: string, 
    description: string, 
    tags?: string[],
    category?: string,
    privacyStatus?: 'public' | 'unlisted' | 'private'
  }): Promise<{
    id: string,
    url: string,
    analyticsUrl: string
  }> => {
    return api.post('/youtube/upload', options)
  },
  
  /**
   * Retrieve analytics for a specific video
   * @param videoId - YouTube video ID
   * @param metrics - Analytics metrics to retrieve
   * @returns Video analytics data
   */
  getVideoAnalytics: async (videoId: string, metrics?: string[]): Promise<{
    views: number,
    likes: number,
    comments: number,
    watchTime: number,
    [key: string]: any
  }> => {
    return api.get(`/youtube/analytics/${videoId}`, { metrics })
  },
  
  /**
   * Update video metadata
   * @param videoId - YouTube video ID
   * @param metadata - Updated metadata
   * @returns Updated video details
   */
  updateVideoMetadata: async (videoId: string, metadata: {
    title?: string,
    description?: string,
    tags?: string[],
    category?: string,
    privacyStatus?: 'public' | 'unlisted' | 'private'
  }): Promise<{
    id: string,
    url: string
  }> => {
    return api.put(`/youtube/videos/${videoId}`, metadata)
  },
  
  /**
   * Retrieve channel statistics
   * @returns Channel statistics
   */
  getChannelStatistics: async (): Promise<{
    subscribers: number,
    views: number,
    videos: number,
    estimatedRevenue: number,
    topVideos: Array<{
      id: string,
      title: string,
      views: number
    }>
  }> => {
    return api.get('/youtube/channel')
  }
}
