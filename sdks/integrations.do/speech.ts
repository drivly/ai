import { api } from 'apis.do'

/**
 * Speech generation service
 */
export const speech = {
  /**
   * Generate voiceover from text
   * @param options - Voiceover generation options
   * @returns Generated audio URL
   */
  generateVoiceover: async (options: {
    script: string,
    voice?: string,
    speed?: number,
    format?: 'mp3' | 'wav',
    quality?: 'standard' | 'high'
  }): Promise<string> => {
    return api.post('/speech/voiceover', options)
  }
}
