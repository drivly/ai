
import { getConfig, type RuntimeConfig, type AIConfig } from './src/config.js'
import { generateMdxContent } from './src/mdx-processor.js'

export type { RuntimeConfig, AIConfig }

export { getConfig, generateMdxContent }

export interface GenerateOptions {
  prompt: string
  model?: string
  type?: string
  schema?: any
  recursive?: boolean
  depth?: number
  onProgress?: (progress: number, message: string) => void
}

export interface GenerateResult {
  content: string
  ast?: any
  outline?: any[]
}

/**
 * Generate MDX content using AI
 * @param options Generation options
 * @returns Generated MDX content
 */
export async function generateMDX(options: GenerateOptions): Promise<GenerateResult> {
  const { prompt, model, type, schema, recursive, depth, onProgress } = options
  
  const config = getConfig({
    ai: {
      defaultModel: model
    },
    onProgress
  })
  
  const content = await generateMdxContent(prompt, {
    type,
    ...schema
  })
  
  return {
    content,
    ast: {},
    outline: []
  }
}

export const ai = new Proxy({}, {
  get: (target, prop) => {
    if (typeof prop === 'string') {
      return async (...args: any[]) => {
        
        return `Result of ${prop}(${args.join(', ')})`
      }
    }
    return undefined
  }
})
