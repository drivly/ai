import { generateText, generateObject } from 'ai'
import { createOpenAI, openai } from '@ai-sdk/openai'
import { anthropic } from '@ai-sdk/anthropic'
import { google } from '@ai-sdk/google'
import { generateSchema } from './schema.js'
import { ReactElement } from 'react'
import { render } from './render.js'

const perplexity = createOpenAI({
  name: 'perplexity',
  apiKey: process.env.PERPLEXITY_API_KEY ?? '',
  baseURL: 'https://api.perplexity.ai/',
})

const getModel = (model: string) => {
  if (model.startsWith('claude')) return anthropic(model)
  if (model.startsWith('gemini')) return google(model)
  if (model.startsWith('perplexity')) return perplexity(model.replace('perplexity-', ''))
  return openai(model, { structuredOutputs: true })
}

export const formatImport = (module: Record<string, any>) => {
  
  const aiFunctions: Record<string, any> = {}
  const schemas: Record<string, any> = {}

  // TODO: figure out how to properly generate the types
  const types: Record<string, any> = {}

  for (const fileName in module) {
    // Extract filename without extension and remove 'ai.' prefix if present
    const name = (fileName.match(/([^/]+?)\.mdx$/)?.[1] || fileName).replace(/^ai\./, '')
    const fn = module[fileName]

    const description = fn.description ?? fn.meta?.description

    const model = getModel(fn.model ?? fn.meta?.model ?? 'gpt-4o')
    const system = fn.system ?? fn.meta?.system
    const seed = fn.seed ?? fn.meta?.seed
    const temperature = fn.temperature ?? fn.meta?.temperature
    const maxTokens = fn.maxTokens ?? fn.meta?.maxTokens
    const metadata = fn.metadata ?? fn.meta?.metadata
    const jsx = fn.default as (props: any) => ReactElement

    const input = fn.input ?? fn.meta?.input
    const inputSchema = input ? generateSchema(input) : undefined
    const output = fn.output ?? fn.meta?.output
    const schema = output ? generateSchema(output) : undefined

    // TODO: figure out the onFinish handler
    const onFinish = (event: any) => {
      // TODO: implement saving to analytics database
      console.log(event)
    }


    if ((typeof output === 'string' && !output.includes('|'))) {
      // If output is a string but not an enum, use text generation
      aiFunctions[name] = (props: any) => render(jsx(props)).then(prompt => generateText({ model, system, prompt, seed, temperature, maxTokens }))

    } else if (typeof output === 'string' && output.includes('|')) {
      // If output is a string and includes '|', use object generation with enum
      const values = output.split('|').map((v) => v.trim())
      aiFunctions[name] = (props: any) => render(jsx(props)).then(prompt => generateObject({ model, system, prompt, seed, temperature, maxTokens, output: 'enum', enum: values }))
      
    } else if (!output) {
      // If output is not defined, use object generation without schema
      aiFunctions[name] = (props: any) => render(jsx(props)).then(prompt => generateObject({ model, system, prompt, seed, temperature, maxTokens, output: 'no-schema' }))

    } else {
      // If output is an object, use object generation with schema
      // @ts-ignore TODO: figure out why the schemaName and schema are not typed correctly
      aiFunctions[name] = (props: any) => render(jsx(props)).then(prompt => generateObject({ model, system, prompt, seed, temperature, maxTokens, schemaName: name, schema }))
    }
  }

  return { aiFunctions, schemas }
}

export const ai = formatImport(import.meta.glob(['../ai/**/*.mdx', '../**/ai.*.mdx'], { eager: true }))
