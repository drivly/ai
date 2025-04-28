import type { DatabaseClient } from 'database.do'
import type { Root } from 'mdast'

export type ModelName = string

export interface AIConfig {
  model?: ModelName
  system?: string
  temperature?: number
  seed?: number
  schema?: Record<string, any>
}

// Markdown output type
export interface MarkdownOutput {
  markdown: string
  mdast: Root
}

export interface VideoOutput {
  outputPath: string
  duration: number
  size: number
}

// Generic AI function type
export type AIFunction<TInput = any, TOutput = any> = {
  (input: TInput, config?: AIConfig): Promise<TOutput>
}

// Types for function definitions
// Define StringArray as an array of string literals to help TypeScript better infer element types
export type StringArray = Array<string>

export type SchemaValue = string | StringArray | { [key: string]: SchemaValue } | SchemaValue[]

export type FunctionDefinition = Record<string, SchemaValue>

// Helper type to convert schema to output type
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

export interface Context {
  ai: AIProxy
  api: APIAccess
  db: DatabaseAccess
}

export interface APIAccess {
  [service: string]: {
    [method: string]: (...args: any[]) => Promise<any>
  }
}

export type DatabaseAccess = DatabaseClient

// Function callback type
export type FunctionCallback<TArgs = any> = (args: TArgs, ctx: Context) => Promise<any>

// Main AI function factory type
export type AI = {
  <T extends Record<string, FunctionDefinition | FunctionCallback>>(
    functions: T,
    config?: AIConfig,
  ): {
    [K in keyof T]: T[K] extends FunctionDefinition ? AIFunction<any, SchemaToOutput<T[K]>> : T[K] extends FunctionCallback<infer TArgs> ? FunctionCallback<TArgs> : never
  }
}

export type TemplateLiteralInput = TemplateStringsArray | [TemplateStringsArray, ...any[]]

export interface TaggedTemplateFunction {
  (strings: TemplateStringsArray, ...values: any[]): Promise<string>
}

export interface ConfigurableAIProxy {
  (config: AIConfig): TaggedTemplateFunction & AIProxy
}

export type AIProxy = {
  [K: string]: AIFunction<any, any> &
    (<T = any>(input?: any, config?: AIConfig) => Promise<T>) &
    (<T = any>(schema: FunctionDefinition, config?: AIConfig) => (input: any, inputConfig?: AIConfig) => Promise<T>) &
    (<T = any>(input?: any, schema?: FunctionDefinition, config?: AIConfig) => Promise<T>)
} & TaggedTemplateFunction &
  ConfigurableAIProxy

// Helper type to infer array element types
export type ArrayElementType<T> = T extends (infer U)[] ? U : never
