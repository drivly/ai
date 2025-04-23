import { executeCodeFunction } from '@/tasks/code/executeCodeFunction'

export async function secureEvaluateMDX(mdxContent: string, components = {}) {
  const code = `
    const { evaluate } = require('@mdx-js/mdx')
    
    try {
      const result = await evaluate(args.mdxContent, {
        jsx: true,
        outputFormat: 'function-body',
      })
      
      return result
    } catch (error) {
      throw new Error(\`MDX evaluation error: \${error.message || String(error)}\`)
    }
  `
  
  const { result, error, logs } = await executeCodeFunction({
    code,
    args: { mdxContent, components },
    timeout: 10000,
    memoryLimit: 256,
  })
  
  if (error) throw new Error(`MDX evaluation failed: ${error}`)
  
  return result
}
