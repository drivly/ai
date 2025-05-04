'use server'

import { models } from '@/pkgs/language-models/dist'
import { cache } from 'react'

export const getModelProviders = cache(async () => {
  const providers = new Set<string>()
  models.forEach((model) => {
    if (model.endpoint && 'providerName' in model.endpoint) {
      providers.add(model.endpoint.providerName as string)
    }
  })
  return Array.from(providers).sort()
})


export const getAvailableModels = cache(async () => {
  return models.filter((model) => {
    if (model.endpoint && 'isFree' in model.endpoint && model.endpoint.isFree !== true) {
      return true
    } else {
      return false
    }
  })
})
