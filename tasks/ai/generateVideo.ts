import { TaskConfig } from 'payload'
import { parseMarkdownWithFrontmatter, createVideoFromSlides } from 'motion.md'

type GenerateVideoInput = {
  markdown: string
  outputPath?: string
  options?: {
    tts?: boolean
    quality?: 'draft' | 'production'
    [key: string]: any
  }
}

/**
 * Task to generate a video from markdown content
 */
export const generateVideo = async ({ input, req, payload }: any) => {
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
      output: {
        success: true,
        outputPath: result.outputPath,
        duration: result.duration,
        size: result.size,
      },
      state: 'succeeded',
    }
  } catch (error: any) {
    console.error('Error generating video:', error)
    return {
      output: {
        success: false,
        error: error.message || String(error),
      },
      state: 'failed',
    }
  }
}

export const generateVideoTask = {
  slug: 'executeFunction',
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
    { name: 'error', type: 'text' },
  ],
  handler: generateVideo,
} as TaskConfig<'executeFunction'>
