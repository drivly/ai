export * from './parser'
export * from './aliases'
export * from './providers'
import allModels from './models'
import type { Model } from './types'
export * from './types'

export const models = allModels.models as unknown as Model[]

export const modelPattern = /^(?:[\w-]+\/)?[\w.-]+(?:@[\w-]+(?::[\w-]+)?)?(?<!@)\([^()]*(?:\([^()]*\)[^()]*)*\)$/
