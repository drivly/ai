import { API } from '@/lib/api'
import { getOpenRouterModels } from '@/lib/openrouterModels'

export const GET = API(async (request) => {
  return getOpenRouterModels(request)
})
