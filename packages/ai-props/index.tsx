import { generateObject } from 'ai'
import { z, ZodSchema } from 'zod'
import React from 'react'
// import { Suspense } from 'react'

type AISchema = {
  [key: string]: string | [string] | AISchema
}

export type AIProps<T> = {
  children: React.ReactElement<T>
  schema: ZodSchema<T> 
} & Parameters<typeof generateObject>[0]

export const AI = async <T,>({ children,  ...config }: AIProps<T>) => {
  const { object } = await generateObject(config)
  return React.isValidElement(children) 
    ? React.cloneElement(children, object as Partial<T>)
    : children
}

