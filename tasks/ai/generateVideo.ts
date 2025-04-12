import { parseMarkdownWithFrontmatter, createVideoFromSlides } from '../../pkgs/motion-md'
import { VideoGenerationOptions, VideoResult } from '../../pkgs/motion-md/src/types'

type GenerateVideoInput = {
  markdown: string
  outputPath?: string
  options?: {
    tts?: boolean
    quality?: 'draft' | 'production'
    [key: string]: any
  }
}

type GenerateVideoOutput = {
  success: boolean
  outputPath: string
  duration: number
  size: number
}

/**
 * Task to generate a video from markdown content
 */
export const generateVideo = async ({ input, req }: { input: GenerateVideoInput; req: any }): Promise<GenerateVideoOutput> => {
  try {
    const { globalConfig, slides } = parseMarkdownWithFrontmatter(input.markdown)
    
    const outputPath = input.outputPath || globalConfig.output || 'output.mp4'
    
    const result = await createVideoFromSlides({
      slides,
      config: globalConfig,
      outputPath,
      options: input.options,
    })
    
    return {
      success: true,
      outputPath: result.outputPath,
      duration: result.duration,
      size: result.size,
    }
  } catch (error) {
    console.error('Error generating video:', error)
    throw new Error(`Failed to generate video: ${error.message}`)
  }
}

export const generateVideoTask = {
  slug: 'generateVideo',
  label: 'Generate Video from Markdown',
  inputSchema: [
    { name: 'markdown', type: 'text', required: true },
    { name: 'outputPath', type: 'text' },
    { name: 'options', type: 'json' },
  ],
  outputSchema: [
    { name: 'success', type: 'boolean' },
    { name: 'outputPath', type: 'text' },
    { name: 'duration', type: 'number' },
    { name: 'size', type: 'number' },
  ],
  handler: generateVideo,
}
