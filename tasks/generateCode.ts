import { TaskConfig } from 'payload'
import { Project } from 'ts-morph'

// Helper to parse TypeScript code from markdown or plain text
export const parseCodeFromResponse = (text: string): string => {
  // Check if the response is in markdown format with code blocks
  const markdownCodeBlockRegex = /```(?:ts|typescript)\s*([\s\S]*?)```/g
  const matches = [...text.matchAll(markdownCodeBlockRegex)]

  if (matches.length > 0) {
    // Extract code from the first TypeScript code block
    return matches[0][1].trim()
  }

  // If no markdown code blocks found, assume it's pure TypeScript
  return text.trim()
}

// Helper to parse and validate TypeScript code using AST
export const parseTypeScriptAST = (code: string) => {
  const project = new Project({ useInMemoryFileSystem: true })
  const sourceFile = project.createSourceFile('temp.ts', code)

  // Extract functions, types, and tests
  const functions = sourceFile.getFunctions()
  const interfaces = sourceFile.getInterfaces()
  const types = sourceFile.getTypeAliases()
  const classes = sourceFile.getClasses()

  // Basic validation
  const diagnostics = sourceFile.getPreEmitDiagnostics()
  const hasErrors = diagnostics.length > 0

  return {
    code,
    sourceFile,
    functions,
    interfaces,
    types,
    classes,
    diagnostics,
    hasErrors,
  }
}

// Generate code using the AI and parse the response
export const generateCode = async (input: any, config?: any) => {
  // Import dynamically to avoid circular dependencies
  const { ai } = await import('../sdks/functions.do')

  const systemMessage =
    'Only respond with Typescript functions, starting with a defined type decorated with JSDoc, followed by a Vitest unit test (assuming `describe`, `expect`, and `it` are already imported into scope), and finally providing a well-documented implementation of the function.'

  // Use the dynamic ai instance to call generateText with our custom system message
  const response = await ai.generateText(input, {
    ...config,
    system: systemMessage,
  })

  // Parse the response text to extract code
  const codeString = typeof response === 'string' ? parseCodeFromResponse(response) : parseCodeFromResponse(JSON.stringify(response))

  // Parse and validate the TypeScript code
  const parsedCode = parseTypeScriptAST(codeString)

  // Return both the original response and the parsed code
  return {
    raw: response,
    code: codeString,
    parsed: parsedCode,
  }
}

// Define the task configuration
export const generateCodeTask = {
  retries: 3,
  slug: 'generateCode',
  label: 'Generate Code',
  inputSchema: [
    { name: 'prompt', type: 'text', required: true },
    { name: 'settings', type: 'json' },
  ],
  outputSchema: [
    { name: 'raw', type: 'json' },
    { name: 'code', type: 'text' },
    { name: 'parsed', type: 'json' },
  ],
  handler: generateCode,
} as unknown as TaskConfig
