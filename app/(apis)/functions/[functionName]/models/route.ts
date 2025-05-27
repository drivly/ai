import { API } from '@/lib/api'

let models: Record<string, any>
// let models: Record<string, Record<string, any>> = {
//   // TODO: figure out if there is a better way to organize/share this in a clickable API
//   // openai: {},
//   // anthropic: {},
//   // google: {},
// }
let dataCount: number

export const GET = API(async (request, { db, user, payload, params, req }) => {
  if (!models) {
    models = {}
    const url = 'https://openrouter.ai/api/frontend/models/find?supported_parameters=response_format'
    const { data } = await fetch(url).then((res) => res.json())
    // data.models.forEach((model: any) => models[model.slug?.split('/').pop().replace(':free', '')] = model.slug)
    data.models.forEach((model: any) => {
      const url = new URL(request.url)
      url.pathname = url.pathname.replace('/models', '')
      url.searchParams.set('model', model.slug)
      models[model.name?.replace(' (free)', '')] = url.toString()
    })
    dataCount = Object.keys(models).length
  }
  return { models, count: Object.keys(models).length, dataCount }
})
