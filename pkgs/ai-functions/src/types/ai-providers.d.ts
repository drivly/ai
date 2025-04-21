declare module 'ai-providers' {
  type ProviderOptions = {
    /**
     * If true, our provider will try to fix the schema of an output
     * using gemini-2.0-lite, taking the output of the model and
     * rewriting it to match the schema.
     */
    allowFixingSchema?: boolean
    /**
     * Tools to be used by the model
     */
    tools?: Record<string, string | number | boolean | Record<string, unknown>>
    /**
     * Priorities for model selection
     */
    priorities?: string[]
    /**
     * Enable reasoning capability
     */
    reasoning?: boolean
    /**
     * Maximum price constraint
     */
    maxPrice?: number
  }

  export function model(modelName: string, options?: ProviderOptions): any
}
