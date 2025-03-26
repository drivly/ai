import { API } from 'clickable-apis'
import { Capability, getModel, Provider, reconstructModelString } from '@/pkgs/ai-models/src'
import { models } from '@/pkgs/ai-models/src/providers'

export const GET = API(async (request, { db, user, origin, url, domain, params }) => {
  // Using the new db interface for more concise syntax
  // const functions = await db.functions.find()

  const originOrApiRoute = !origin.includes('models.do') ? `${origin}/models` : origin

  const modifyQueryString = (param: string, value: string | number, type: 'string' | 'boolean' | 'array' = 'string') => {
    const qs = new URLSearchParams(request.url.split('?')[1])
    // If the value is a boolean, and it exists, remove it
    // otherwise add it

    switch (type) {
      case 'boolean':
        if (qs.has(param)) {
          qs.delete(param)
        } else {
          qs.set(param, value.toString())
        }
        break
      case 'array':
        // arrays are serialized as a comma separated list
        // when the value exists, remove it, otherwise add it, 
        // then re-serialize into a comma separated list
        let existingArray = qs.get(param)?.split(',') ?? []

        if (existingArray.includes(value.toString())) {
          existingArray = existingArray.filter((item) => item !== value.toString())
        } else {
          existingArray.push(value.toString())
        }

        qs.set(param, existingArray.join(','))

        break
      case 'string':
        qs.set(param, value.toString())
        break
    }

    // Remove any empty values but ignore models because it can be an empty string.
    qs.forEach((value, key) => {
      if (value === '' && key !== 'models') {
        qs.delete(key)
      }
    })

    return `${originOrApiRoute}?${qs.toString()}`
  }

  const generateLinks = (param: string, options: any[]) => {
    return options?.map((option) => modifyQueryString(param, option)) ?? []
  }

  // Custom groupBy implementation
  // Cannot bump to ES2024 because it breaks imports so we need to use a polyfill
  function groupByKey<T, K extends keyof any>(array: T[], getKey: (item: T) => K) {
    return array.reduce((result, item) => {
      const key = getKey(item);
      if (!result[key]) {
        result[key] = [];
      }
      result[key].push(item);
      return result;
    }, {} as Record<K, T[]>);
  }

  const qs = new URLSearchParams(request.url.split('?')[1])
  const model = qs.get('model')
  const groupBy = qs.get('groupBy') ?? 'author'
  const outputType = qs.get('outputType')
  // We want this to be true even if the value is an empty string
  const groupCreationMode = typeof qs.get('models') === 'string'
  const groupModels = qs.get('models')?.split(',').filter(Boolean) ?? []

  if (model) {
    return {
      resolvedModel: getModel(model),
    }
  }

  // Allow filtering based on qs
  const capabilities = qs.get('capabilities')?.split(',') ?? []
  const provider = qs.get('provider')
  const author = qs.get('author')

  // If outputType is set, we need to add capabilities to the list
  // like a preset, but for capabilities
  // ['Object', 'ObjectArray', 'Text', 'TextArray', 'Markdown', 'Code']
  if (outputType) {
    switch (outputType) {
      case 'Object':
        capabilities.push('structuredOutputs')
        break
      case 'ObjectArray':
        capabilities.push('structuredOutputs')
        break
      case 'Text':
        break
      case 'TextArray':
        break
      case 'Markdown':
        break
      case 'Code':
        break
    }
  }

  const validModels = models.filter((model) => {
    if (provider && model.provider !== provider) return false
    if (author && model.author !== author) return false
    if (capabilities.length > 0) {
      return capabilities.some((capability) => model.capabilities?.includes(capability as Capability))
    }

    return true
  })

  const generateFacet = (param: string, filter: string | null) => {
    const allValues = validModels
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
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1])

    return sorted.map(([value, count]) => ({ [`${value} (${count})`]: modifyQueryString(param, value) })).reduce<Record<string, string>>((acc, curr) => ({ ...acc, ...curr }), {})
  }

  let modelsObject = validModels
    .map((model) => {
      //console.log(model.name, model.alias)
      const reconstructedModelString = reconstructModelString({
        model: model.alias || model.modelIdentifier || '',
        capabilities: capabilities as Capability[],
      })

      const query = new URLSearchParams(qs)
      // Remove any params that are already being used
      // These params are not needed for the exit URL
      const paramsToRemove = [
        'groupBy',
        'capabilities',
        'provider',
        'author'
      ]

      paramsToRemove.forEach((param) => {
        query.delete(param)
      })

      let url = `${originOrApiRoute}/${reconstructedModelString}?${query.toString()}`

      if (groupCreationMode) {
        const newGroupModels = [...groupModels, reconstructedModelString]
        url = modifyQueryString('models', newGroupModels.join(','))
      }

      return {
        url,
        name: model.name,
        author: model.author,
        provider: model.provider,
        capabilities: model.capabilities,
        defaults: model.defaults,
      }
    }).reduce((acc, curr) => {
      return {
        ...acc,
        [curr.name]: curr,
      }
    }, {}) as Record<string, unknown>

  if (groupBy) {
    // Modify the modelsObject to group by the given param
    modelsObject = groupByKey(Object.values(modelsObject) as any[], 
      (model) => model[groupBy as keyof typeof model] as any)
    
    // Strip the object down to just the URL now that we've done the grouping
    modelsObject = Object.fromEntries(Object.entries(modelsObject)
      .map(([key, value]) => [
        key,
        // @ts-expect-error - Ignore 
        value.reduce((acc, curr) => {
          return {
            ...acc,
            [curr.name]: curr.url,
          }
        }, {})
      ])
    )
  }

  return {
    links: {
      createGroup: `${originOrApiRoute}?${qs.toString()}&models=`,
      toLLM: `https://llm.do/chat?model=${ model || groupModels.join(',') }`,
      groupBy: {
        providers: modifyQueryString('groupBy', groupBy === 'provider' ? '' : 'provider'),
        authors: modifyQueryString('groupBy', groupBy === 'author' ? '' : 'author'),
      },
      providers: generateFacet('provider', provider),
      authors: generateFacet('author', author),
      capabilities: {
        tools: modifyQueryString('capabilities', 'tools', 'array'),
        structuredOutputs: modifyQueryString('capabilities', 'structuredOutputs', 'array')
      },
      outputType: {
        // ['Object', 'ObjectArray', 'Text', 'TextArray', 'Markdown', 'Code']
        object: modifyQueryString('outputType', 'Object', 'array'),
        'ObjectArray': modifyQueryString('outputType', 'ObjectArray', 'array'),
        Text: modifyQueryString('outputType', 'Text'),
        'TextArray': modifyQueryString('outputType', 'TextArray', 'array'),
        Markdown: modifyQueryString('outputType', 'Markdown'),
        Code: modifyQueryString('outputType', 'Code'),
      }
    },
    models: modelsObject
  }
})
