import { API } from '@/api.config'
import { getModel } from '@/pkgs/ai-models/src'

export const GET = API(async (request, { db, user, origin, url, domain, params }) => {
  // Using the new db interface for more concise syntax
  // const functions = await db.functions.find()

  const qs = new URLSearchParams(request.url.split('?')[1])
  const model = qs.get('model')

  if (model) {
    return {
      resolvedModel: getModel(model),
    }
  }

  return {
    models: [],
  }
})
