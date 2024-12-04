import { generateObject } from 'ai'
import { z, ZodSchema } from 'zod'
import { dump } from 'js-yaml'
import React from 'react'
// import { Suspense } from 'react'

type AISchema = {
  [key: string]: string | [string] | AISchema
}

export type AIProps<T> = {
  children: React.ReactElement<T>
  args: any
  schema: ZodSchema<T> 
} & Parameters<typeof generateObject>[0]

export const AI = async <T,>({ children, args,  ...config }: AIProps<T>) => {
  config.prompt = config.prompt ? `${config.prompt}\n\n${dump(args)}` : dump(args)
  const { object } = await generateObject(config)
  return React.isValidElement(children) 
    ? React.cloneElement(children, object as Partial<T>)
    : children
}

