// Define our own types that will serve as the foundation

export type ModelName = string

export interface AIConfig {
  model?: ModelName
  system?: string
  temperature?: number
  seed?: number
  schema?: Record<string, any>
  maxTokens?: number
  output?: 'array' | 'enum' | 'no-schema'
  iterator?: boolean
  includeAnalysis?: boolean
  [key: string]: any
}

export type AIFunction<TInput = any, TOutput = any> = {
  (input: TInput, config?: AIConfig): Promise<TOutput>
}

export type StringArray = Array<string>

export type SchemaValue = string | StringArray | { [key: string]: SchemaValue } | SchemaValue[]

export type FunctionDefinition = Record<string, SchemaValue>

export type SchemaToOutput<T extends FunctionDefinition> = {
  [K in keyof T]: T[K] extends Array<any>
    ? T[K] extends Array<string>
      ? string[]
      : T[K] extends Array<Record<string, any>>
        ? Array<{ [P in keyof T[K][0]]: SchemaToOutput<{ value: T[K][0][P] }>['value'] }>
        : string[]
    : T[K] extends Record<string, any>
      ? { [P in keyof T[K]]: SchemaToOutput<{ value: T[K][P] }>['value'] }
      : string
}

export interface MarkdownOutput {
  markdown: string
  mdast: any // Using any for mdast.Root to avoid direct dependency
}

export interface VideoOutput {
  outputPath: string
  duration: number
  size: number
}

/**
 * TypeScript AST node interface
 */
export interface TypeScriptASTNode {
  kind: string
}

/**
 * Generated TypeScript code response
 */
export interface GeneratedTypeScriptCode {
  code: string
  ast?: TypeScriptASTNode
  diagnostics?: { message: string; line?: number; column?: number }[]
}

export interface APIAccess {
  [service: string]: {
    [method: string]: (...args: any[]) => Promise<any>
  }
}

export interface DatabaseAccess {
  [collection: string]: {
    create: (data: Record<string, any>) => Promise<{ url: string } & Record<string, any>>
    findOne: (query: Record<string, any>) => Promise<Record<string, any>>
    find: (query: Record<string, any>) => Promise<Array<Record<string, any>>>
    update: (id: string, data: Record<string, any>) => Promise<Record<string, any>>
    delete: (id: string) => Promise<void>
    [method: string]: (...args: any[]) => Promise<any>
  }
}

export type FunctionCallback<TArgs = any> = (args: TArgs, ctx: Context) => Promise<any>

export type AIProxy = {
  [K: string]: AIFunction<any, any> & 
    (<T = any>(input?: any, config?: AIConfig) => Promise<T>) &
    (<T = any>(schema: FunctionDefinition, config?: AIConfig) => (input: any, inputConfig?: AIConfig) => Promise<T>) &
    (<T = any>(input?: any, schema?: FunctionDefinition, config?: AIConfig) => Promise<T>)
} & TaggedTemplateFunction &
  ConfigurableAIProxy

export interface Context {
  ai: AIProxy
  api: APIAccess
  db: DatabaseAccess
}

export type AI = {
  <T extends Record<string, FunctionDefinition | FunctionCallback>>(
    functions: T,
    config?: AIConfig,
  ): {
    [K in keyof T]: T[K] extends FunctionDefinition ? AIFunction<any, SchemaToOutput<T[K]>> : T[K] extends FunctionCallback<infer TArgs> ? FunctionCallback<TArgs> : never
  }
}

export type ArrayElementType<T> = T extends (infer U)[] ? U : never

export type TemplateLiteralInput = TemplateStringsArray | [TemplateStringsArray, ...any[]]

export interface TaggedTemplateFunction {
  (strings: TemplateStringsArray, ...values: any[]): Promise<string>
}

export interface ConfigurableAIProxy {
  (config: AIConfig): TaggedTemplateFunction & AIProxy
}

// Define our own types since GenerateObjectOptions is not exported from 'ai'
export interface AIFunctionOptions {
  model?: string | any
  temperature?: number
  maxTokens?: number
  schema?: any
  output?: 'array' | 'enum' | 'no-schema'
  iterator?: boolean
  [key: string]: any
}

export interface AIFunctionConfig {
  model?: string | any
  temperature?: number
  maxTokens?: number
  [key: string]: any
}
