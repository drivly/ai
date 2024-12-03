import { generateObject, generateText } from 'ai'
import type { LanguageModel } from 'ai'
import { openai } from '@ai-sdk/openai'
import { anthropic } from '@ai-sdk/anthropic'
import { z } from 'zod'

type Models = Parameters<typeof openai>[0] | Parameters<typeof anthropic>[0]
// type AIConfig = Omit<Partial<Parameters<typeof generateObject>[0]>, 'model'> & { model: Models }
type AIConfig = {
  system?: string
  model?: Models
  seed?: number
  temperature?: number
  topK?: number
  topP?: number
}

type WithUnderscore<T> = {
  [K in keyof T as `_${string & K}`]: T[K];
}

type AISchema = {
  [key: string]: string | [string] | AISchema
} & WithUnderscore<AIConfig & { prompt?: string }>

type AIFunctionSchemas = Record<string, string | [string] | AISchema | [AISchema]>

type AIObjectGenerator =  (schema: AISchema, config?: AIConfig) => Promise<any>
type AITaggedTemplate = (strings: TemplateStringsArray, ...values: any[]) => Promise<string>
type AIPromiseWithConfig = Promise<string> & ((config: AIConfig) => Promise<string>)
type AITaggedTemplateWithConfig = (strings: TemplateStringsArray, ...values: any[]) => AIPromiseWithConfig
type AIFunction = AIObjectGenerator | AITaggedTemplate | AITaggedTemplateWithConfig

export const generateZodSchema = <T extends AISchema>(schema: T): z.ZodObject<any> => {

  const zodSchema: Record<string, any> = {}
  
  Object.entries(schema).forEach(([key, value]) => {
    if (key.startsWith('_')) return
    
    if (typeof value === 'string') {
      if (value.includes(' | ')) {
        const enumValues = value.split(' | ') as [string, ...string[]];
        zodSchema[key] = z.enum(enumValues)
      } else {
        zodSchema[key] = z.string().describe(value)
      }
    } else if (Array.isArray(value)) {
      if (typeof value[0] === 'string') {
        zodSchema[key] = z.array(z.string()).describe(value[0])
      } else {
        zodSchema[key] = z.array(generateZodSchema(value[0]))
      }
    } else if (typeof value === 'object') {
      zodSchema[key] = generateZodSchema(value)
    }
  })

  return z.object(zodSchema) as z.ZodObject<{
    [K in keyof T]: T[K] extends string
      ? T[K] extends `${string} | ${string}`
        ? z.ZodEnum<[string, ...string[]]>
        : z.ZodString
      : T[K] extends [string]
      ? z.ZodArray<z.ZodString>
      : T[K] extends [AISchema]
      ? z.ZodArray<ReturnType<typeof generateZodSchema<T[K][0]>>>
      : T[K] extends AISchema
      ? ReturnType<typeof generateZodSchema<T[K]>>
      : never
  }>
}

export const generateObjectFromSchema = (fn: string, args: any, schema: AISchema, config?: AIConfig) => {
  return generateObject({
    ...config,
    // TODO: create evals and tests for prompt construction ... like yaml vs json, converting function name to title case, etc
    prompt: `${fn}(${JSON.stringify(args)})`,
    model: config?.model ? (config.model.startsWith('claude') ? anthropic(config.model) : openai(config.model)) : openai('gpt-4o'),
    schema: generateZodSchema(schema),
  }).then(result => result.object)
}

export const extractConfig = (schema: AISchema) => {
  const config: AIConfig = {}
  for (const key in schema) {
    if (key.startsWith('_')) {
      const configKey = key.slice(1) as keyof AIConfig
      config[configKey] = schema[key] as any
    }
  }
  return config
}

export const AI = (init: AIConfig & AIFunctionSchemas) => {
  let { system, model, seed, temperature, topK, topP, ...functions } = init
  return { 
    ai: new Proxy(functions, {
      get: (target, prop: string | symbol) => {
        if (typeof prop === 'string' ) {
          if (prop in target) {
            const schema = target[prop] as AISchema
            return async (args: any) => generateObjectFromSchema(prop, args, schema, extractConfig(target[prop as keyof typeof target] as AISchema))
          } else {
            // support use case where schema here is a string, which then is simply a prompt in a generateText call
            return (input: string | AISchema, config?: AIConfig) => {
              if (typeof(input) === 'string') {
                return generateText({
                  ...config,
                  prompt: input,
                  model: config?.model ? (config.model.startsWith('claude') ? anthropic(config.model) : openai(config.model)) : openai('gpt-4o'),
                })
              } else {
                return async (args: any) => generateObjectFromSchema(prop, args, input, extractConfig(input))
              }
            }
          }
        }
      },
      apply: (target, thisArg, args) => {
        if (typeof args[0] === 'string') {
          return generateText({
            prompt: args[0],
            model: model ? (model.startsWith('claude') ? anthropic(model) : openai(model)) : openai('gpt-4o'),
          })
        } else if (Array.isArray(args[0])) {
          // this is a tagged template literal string function
          const prompt = args[0].reduce((acc, str, i) => acc + str + (args[i] || ''), '')
          return generateText({
            prompt,
            model: model ? (model.startsWith('claude') ? anthropic(model) : openai(model)) : openai('gpt-4o'),
          })
        } else {
          return generateObjectFromSchema('ai', args[0], args[0], extractConfig(args[0]))
        }
      }
    })
  }
}



// export function ai(strings: TemplateStringsArray | string, ...values: any[]): AIPromiseWithConfig {
//   // Create the base promise
//   const basePromise = new Promise<string>((resolve) => {
//     const prompt = typeof strings === 'string' 
//       ? strings 
//       : strings.reduce((acc, str, i) => acc + str + (values[i] || ''), '');
//     resolve(prompt);
//   });

//   // Create a callable function that returns a new promise
//   const callable = ((config?: AIConfig) => {
//     if (config) {
//       return basePromise.then(prompt => prompt);
//     }
//     return basePromise;
//   }) as AIPromiseWithConfig;

//   // Copy over Promise methods to make it "thenable"
//   Object.setPrototypeOf(callable, Promise.prototype);
  
//   // Copy the promise methods from basePromise to our callable function
//   const methods = ['then', 'catch', 'finally'] as const;
//   methods.forEach(method => {
//     (callable as any)[method] = basePromise[method].bind(basePromise);
//   });

//   return callable;
// }
