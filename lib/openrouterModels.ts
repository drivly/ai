export interface OpenRouterModelsResult {
  models: Record<string, string>
  count: number
  dataCount: number
}

let cachedModels: Record<string, string> | null = null
let cachedCount = 0

export async function getOpenRouterModels(request?: Request): Promise<OpenRouterModelsResult> {
  if (!cachedModels) {
    const url = 'https://openrouter.ai/api/frontend/models/find?supported_parameters=response_format'
    const { data } = await fetch(url).then((res) => res.json())

    cachedModels = {}
    for (const model of data.models as any[]) {
      if (request) {
        const target = new URL(request.url)
        target.pathname = target.pathname.replace(/\/?models$/, '')
        target.searchParams.set('model', model.slug)
        cachedModels[model.name?.replace(' (free)', '')] = target.toString()
      } else {
        cachedModels[model.name?.replace(' (free)', '')] = model.slug
      }
    }

    cachedCount = Object.keys(cachedModels).length
  }

  return { models: cachedModels!, count: Object.keys(cachedModels!).length, dataCount: cachedCount }
}

