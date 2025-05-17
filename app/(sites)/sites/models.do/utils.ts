import { Model, models } from 'language-models'
import qs from 'query-string'
import { cache } from 'react'

export const getAvailableModels = cache(() => {
  const packageModels = new Set<Model>()

  for (const model of models) {
    if (model.endpoint && 'isFree' in model.endpoint && model.endpoint.isFree !== true) {
      packageModels.add(model)
    }
  }

  return Array.from(packageModels).sort((a, b) => b.createdAt.localeCompare(a.createdAt))
})

export const getModelProviders = cache(() => {
  const providers = new Set<string>()
  const availableModels = getAvailableModels()

  availableModels.forEach((model) => {
    if (model.endpoint && 'providerName' in model.endpoint) {
      providers.add(model.endpoint.providerName as string)
    }
  })
  return Array.from(providers).sort()
})

interface UrlQueryParams {
  params: string
  key: string
  value: string | null
}

export const formUrlQuery = ({ params, key, value }: UrlQueryParams) => {
  const currentUrl = qs.parse(params.toString())
  currentUrl[key] = value

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true },
  )
}

interface RemoveKeysParams {
  params: string
  keys: string[]
}
export const removeKeysFromQuery = ({ params, keys }: RemoveKeysParams) => {
  const currentUrl = qs.parse(params)

  keys.forEach((key) => {
    delete currentUrl[key]
  })

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true },
  )
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date)
}
