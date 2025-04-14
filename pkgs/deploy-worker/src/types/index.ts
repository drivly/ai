/**
 * Represents a Cloudflare Worker to be deployed
 */
export type Worker = {
  /**
   * TypeScript code for the worker
   */
  code: string

  /**
   * Unit tests to run in Vitest
   */
  tests: string

  /**
   * Cloudflare Worker metadata object
   */
  metadata: WorkerMetadata
}

/**
 * Cloudflare Worker metadata
 * @see https://developers.cloudflare.com/workers/configuration/multipart-upload-metadata/
 */
export type WorkerMetadata = {
  /**
   * The main module of the worker
   */
  main_module: string

  /**
   * The compatibility date for the worker
   */
  compatibility_date: string

  /**
   * Optional compatibility flags
   */
  compatibility_flags?: string[]

  /**
   * Optional bindings for the worker
   */
  bindings?: Array<
    PlainTextBinding | SecretTextBinding | KVNamespaceBinding | DONamespaceBinding | WasmModuleBinding | ServiceBinding | R2BucketBinding | AnalyticsEngineBinding | QueueBinding
  >
}

/**
 * Plain text binding
 */
export type PlainTextBinding = {
  type: 'plain_text'
  name: string
  text: string
}

/**
 * Secret text binding
 */
export type SecretTextBinding = {
  type: 'secret_text'
  name: string
  text: string
}

/**
 * KV namespace binding
 */
export type KVNamespaceBinding = {
  type: 'kv_namespace'
  name: string
  namespace_id: string
}

/**
 * Durable Object namespace binding
 */
export type DONamespaceBinding = {
  type: 'durable_object_namespace'
  name: string
  class_name: string
  script_name?: string
}

/**
 * WebAssembly module binding
 */
export type WasmModuleBinding = {
  type: 'wasm_module'
  name: string
  part: string
}

/**
 * Service binding
 */
export type ServiceBinding = {
  type: 'service'
  name: string
  service: string
  environment?: string
}

/**
 * R2 bucket binding
 */
export type R2BucketBinding = {
  type: 'r2_bucket'
  name: string
  bucket_name: string
}

/**
 * Analytics Engine binding
 */
export type AnalyticsEngineBinding = {
  type: 'analytics_engine'
  name: string
  dataset: string
}

/**
 * Queue binding
 */
export type QueueBinding = {
  type: 'queue'
  name: string
  queue_name: string
}

/**
 * Result of the deployment process
 */
export type DeployResult = {
  /**
   * Whether the deployment was successful
   */
  success: boolean

  /**
   * Errors encountered during the deployment process
   */
  errors?: string[]

  /**
   * URL of the deployed worker if successful
   */
  deploymentUrl?: string

  /**
   * Stage of the deployment process where the result was determined
   */
  stage?: 'typescript-validation' | 'eslint-validation' | 'test-execution' | 'bundling' | 'deployment' | 'deployed'
}

/**
 * Options for the TypeScript compiler
 */
export type TypeScriptOptions = {
  /**
   * Whether to check types
   */
  checkTypes?: boolean

  /**
   * TypeScript compiler options
   */
  compilerOptions?: Record<string, any>
}

/**
 * Options for ESLint
 */
export type ESLintOptions = {
  /**
   * Whether to run ESLint
   */
  runLint?: boolean

  /**
   * ESLint configuration
   */
  config?: Record<string, any>
}

/**
 * Options for Vitest
 */
export type VitestOptions = {
  /**
   * Whether to run tests
   */
  runTests?: boolean

  /**
   * Vitest configuration
   */
  config?: Record<string, any>
}

/**
 * Options for ESBuild
 */
export type ESBuildOptions = {
  /**
   * ESBuild configuration
   */
  config?: Record<string, any>
}

/**
 * Options for the Cloudflare API
 */
export type CloudflareOptions = {
  /**
   * Cloudflare account ID
   */
  accountId?: string

  /**
   * Cloudflare API token
   */
  apiToken?: string

  /**
   * Cloudflare Workers for Platforms namespace ID
   */
  namespaceId?: string

  /**
   * Maximum number of retry attempts for API calls
   */
  maxRetries?: number

  /**
   * Base delay in milliseconds between retry attempts
   */
  retryDelay?: number
}

/**
 * Options for the deployWorker function
 */
export type DeployWorkerOptions = {
  /**
   * TypeScript options
   */
  typescript?: TypeScriptOptions

  /**
   * ESLint options
   */
  eslint?: ESLintOptions

  /**
   * Vitest options
   */
  vitest?: VitestOptions

  /**
   * ESBuild options
   */
  esbuild?: ESBuildOptions

  /**
   * Cloudflare options
   */
  cloudflare?: CloudflareOptions
}
