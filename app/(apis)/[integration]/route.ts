import { API } from '@/lib/api'

export const GET = API(async (request, { params: { integration }, origin }) => {
  return Response.redirect(`${origin}/integrations/${integration}`, 302)
})
