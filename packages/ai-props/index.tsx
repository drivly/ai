import { generateObject } from 'ai'
import { openai } from '@ai-sdk/openai'
import { object, z } from 'zod'
import { dump } from 'js-yaml'
import React from 'react'
// import { Suspense } from 'react'

type AISchema<T = Record<string, any>> = {
  [key: string]: string | [string] | AISchema<T>
}

// Add this type helper to infer schema shape
type InferSchemaType<T extends AISchema> = {
  [K in keyof T]: T[K] extends string
    ? string
    : T[K] extends [infer U]
      ? U extends AISchema
        ? InferSchemaType<U>[]
        : string[]
      : T[K] extends AISchema
        ? InferSchemaType<T[K]>
        : never
}

export type AIProps<TSchema extends AISchema> = {
  children: React.ReactElement<InferSchemaType<TSchema>>
  args?: any
  list?: string
  schema: TSchema
  model?: Parameters<typeof openai>[0]
} & Partial<Omit<Parameters<typeof generateObject>[number], 'model' | 'schema'>>

export const AI = async <TSchema extends AISchema>({ children, args, list, model = 'gpt-4o', ...config }: AIProps<TSchema>) => {
  if (list) {
    config.prompt = config.prompt ? `${config.prompt}\n\nList ${list}` : 'List ' + list
    config.mode = 'json'
  } else {
    config.prompt = config.prompt ? `${config.prompt}\n\n${dump(args)}` : dump(args)
    config.mode = 'json'
  }
  const schema = generateZodSchema(config.schema)
  const response = await generateObject({ ...config, schema, output: list ? 'array' : 'object', model: openai(model, { structuredOutputs: true }) } as any)
  console.log(response)
  if (list && Array.isArray(response.object)) {
    return response.object.map((item, i) => React.cloneElement(children, { ...item, key: i } as Partial<InferSchemaType<TSchema>>))
  }
  return React.isValidElement(children) ? React.cloneElement(children, response.object as Partial<InferSchemaType<TSchema>>) : children
}

export const generateZodSchema = (schema: AISchema): z.ZodObject<any> => {
  const zodSchema: Record<string, any> = {}

  Object.entries(schema).forEach(([key, value]) => {
    if (key.startsWith('_')) return

    if (typeof value === 'string') {
      if (value.includes(' | ')) {
        const enumValues = value.split(' | ') as [string, ...string[]]
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

  return z.object(zodSchema)
}
