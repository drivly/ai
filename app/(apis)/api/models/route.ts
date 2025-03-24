import { API } from 'clickable-apis'
import { Capability, getModel, Provider } from '@/pkgs/ai-models/src'
import { models } from '@/pkgs/ai-models/src/providers'

export const GET = API(async (request, { db, user, origin, url, domain, params }) => {
  // Using the new db interface for more concise syntax
  // const functions = await db.functions.find()

  const originOrApiRoute = origin.includes('localhost') ? `${origin}/api/models` : origin

  const modifyQueryString = (param: string, value: string | number) => {
    const qs = new URLSearchParams(request.url.split('?')[1])
    qs.set(param, value.toString())
    return `${originOrApiRoute}?${qs.toString()}`
  }

  const generateLinks = (param: string, options: any[]) => {
    return options.map((option) => modifyQueryString(param, option))
  }

  const qs = new URLSearchParams(request.url.split('?')[1])
  const model = qs.get('model')

  if (model) {
    return {
      resolvedModel: getModel(model),
    }
  }

  // Allow filtering based on qs
  const capabilities = qs.get('capabilities')?.split(',') ?? []
  const provider = qs.get('provider')
  const author = qs.get('author')

  const generateFacet = (param: string, filter: string | null) => {
    const allValues = models
      .map((model) => model[param as keyof typeof model])
      .filter((value) => !filter || value === filter)

    // Now count and sort by count
    const counts = allValues.reduce((acc: Record<string, number>, value: unknown) => {
      const stringValue = value as string
      if (acc[stringValue]) {
        acc[stringValue]++
      } else {
        acc[stringValue] = 1
      }

      return acc
    }, {})

    // Sort by count
    const sorted = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])

    return sorted
      .map(([value, count]) => ({ [`${value} (${count})`]: modifyQueryString(param, value) }))
      .reduce<Record<string, string>>((acc, curr) => ({ ...acc, ...curr }), {})
  }

  return {
    links: {
      providers: generateFacet('provider', provider),
      authors: generateFacet('author', author),
    },
    models: models
      .filter((model) => {
        if (capabilities.length > 0) {
          return capabilities.some((capability) => model.capabilities?.includes(capability as Capability))
        }

        return (
          (!provider || model.provider === provider) &&
          (!author || model.author === author)
        )
      })
      .map(model => {
        return {
          url: `${originOrApiRoute}/${model.openRouterSlug}`,
          name: model.name,
          author: model.author,
          provider: model.provider,
          capabilities: model.capabilities,
          defaults: model.defaults,
        }
      }).splice(0, 10),
  }
})
