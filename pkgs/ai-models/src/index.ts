export * from './parser'
export * from './aliases'
import allModels from './models'
import type { Model } from './types'
export * from './types'

export const models = allModels.models as unknown as Model[]

// Temp regex. Will replace once the deadline passes.
export const modelPattern = new RegExp('^.*$')