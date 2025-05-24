import { API } from '@/lib/api'
import camelcase from 'camelcase'
import { constructModelIdentifier, filterModels, models, parse } from 'language-models'
import { groupByKey } from './utils'

export const GET = API(async (request, { db, user, origin, url, domain, params }) => {
  // Using the new db interface for more concise syntax
  // const functions = await db.functions.find()

  const originOrApiRoute = !origin.includes('models.do') ? `${origin}/models` : `${origin}/api`

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

    return `${originOrApiRoute}?${qs.toString()}`.replaceAll('%3A', ':').replaceAll('%2C', ',')
  }

  const generateLinks = (param: string, options: any[]) => {
    return options?.map((option) => modifyQueryString(param, option)) ?? []
  }

  const qs = new URLSearchParams(request.url.split('?')[1])
  const model = qs.get('model')
  const groupBy = qs.get('groupBy') ?? 'author'
  const outputType = qs.get('outputType')
  // We want this to be true even if the value is an empty string
  const groupCreationMode = typeof qs.get('models') === 'string'
  const groupModels = qs.get('models')?.split(',').filter(Boolean) ?? []
  const sortByUntyped = qs.get('sort') ?? 'top-weekly'

  // Ensure sortBy is one of the valid sorting values
  const allowedSortingValues = ['topWeekly', 'newest', 'throughputHighToLow', 'latencyLowToHigh', 'pricingLowToHigh', 'pricingHighToLow']
  const sortBy = allowedSortingValues.includes(sortByUntyped) ? sortByUntyped : undefined

  if (model) {
    const targetModel = filterModels(model)
    return {
      resolvedModel: targetModel.models[0],
      parsed: targetModel.parsed,
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

  let validModels = models.filter((model) => {
    if (author && model.author !== author) return false
    if (capabilities.length > 0) {
      return capabilities.some((capability) => model.endpoint?.supportedParameters?.includes(camelcase(capability)))
    }

    return true
  })

  // Sort the models
  if (sortBy) {
    // Sort using the sorting object
    validModels = validModels.sort((a, b) => {
      // @ts-expect-error - Ignore
      return a.sorting[sortBy] - b.sorting[sortBy]
    })
  } else {
    validModels = validModels
  }

  const generateFacet = (param: string, filter: string | null) => {
    const allValues = validModels.map((model) => model[param as keyof typeof model]).filter((value) => !filter || value === filter)

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
      const modelId = model.slug || ''

      const allFeaturesCombined = [...capabilities, outputType ?? '']

      const parsedModel = parse(`${modelId}(${allFeaturesCombined.join(',')})`)

      const reconstructedModelString = constructModelIdentifier(parsedModel)

      const query = new URLSearchParams(qs)
      // Remove any params that are already being used
      // These params are not needed for the exit URL
      const paramsToRemove = ['groupBy', 'capabilities', 'provider', 'author', 'outputType']

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
        provider: model.providers?.[0]?.slug,
        capabilities: model.endpoint?.supportedParameters,
        priceInput: model.endpoint?.pricing.prompt,
        priceOutput: model.endpoint?.pricing.completion,
      }
    })
    .reduce((acc, curr) => {
      return {
        ...acc,
        [curr.name]: curr,
      }
    }, {}) as Record<string, unknown>

  if (groupBy && !sortBy) {
    // Modify the modelsObject to group by the given param
    modelsObject = groupByKey(Object.values(modelsObject) as any[], (model) => model[groupBy as keyof typeof model] as any)

    // Strip the object down to just the URL now that we've done the grouping
    modelsObject = Object.fromEntries(
      Object.entries(modelsObject).map(([key, value]) => [
        key,
        // @ts-expect-error - Ignore
        value.reduce((acc, curr) => {
          return {
            ...acc,
            [curr.name]: curr.url,
          }
        }, {}),
      ]),
    )
  } else {
    // Just strip the object down to just the URL now that we've done the grouping

    modelsObject = Object.fromEntries(
      Object.entries(modelsObject).map(([key, value]) => {
        let postfix = ''

        return [key + postfix, (value as { url: string }).url]
      }),
    )
  }

  const llmDoUrl = origin.includes('localhost') ? 'http://localhost:8787' : 'https://llm.do'

  return {
    links: {
      toLLM: `${llmDoUrl}/chat/arena?model=${model || groupModels.join(',')}`,
      groupPresets: {
        custom: modifyQueryString('models', groupModels.join(',')),
        frontier: modifyQueryString('models', 'claude-3.7-sonnet,o3-mini,gemini'),
        frontierReasoning: modifyQueryString('models', 'claude-3.7-sonnet:reasoning,gemini-2.0-flash-thinking-exp:free,r1:reasoning,sonar-deep-research:reasoning'),
        cheapReasoning: modifyQueryString('models', 'qwq-32b:reasoning,deepseek-r1-distill-llama-70b:reasoning'),
        coding: modifyQueryString('models', 'claude-3.7-sonnet,o3-mini,deepseek-v3'),
        roleplay: modifyQueryString('models', 'mythomax-l2-13b,wizardlm-2-7b,claude-3.7-sonnet,ministral-8b'),
        cheapAndFast: modifyQueryString('models', 'gemini,gemma-3,gpt-4o-mini,ministral-8b'),
        wideRange: modifyQueryString('models', 'claude-3.7-sonnet,gemini,gpt-4o-mini,ministral-8b,qwq-32b'),
      },
      // The current active group
      editModels: groupModels
        .map((model) => {
          return [model, `${originOrApiRoute}/${model}?${qs.toString()}`]
        })
        .reduce((acc, [model, url]) => {
          return {
            ...acc,
            [model]: url,
          }
        }, {}),
      sortBy: allowedSortingValues
        .map((sortingValue) => {
          return {
            [String(sortingValue)]: modifyQueryString('sort', String(sortingValue)),
          }
        })
        .reduce((acc, curr) => ({ ...acc, ...curr }), {}),
      groupBy: {
        providers: modifyQueryString('groupBy', groupBy === 'provider' ? '' : 'provider'),
        authors: modifyQueryString('groupBy', groupBy === 'author' ? '' : 'author'),
      },
      capabilities: {
        tools: modifyQueryString('capabilities', 'tools', 'array'),
        structuredOutputs: modifyQueryString('capabilities', 'structuredOutputs', 'array'),
        reasoning: modifyQueryString('capabilities', 'reasoning', 'array'),
        vision: modifyQueryString('capabilities', 'vision', 'array'),
      },
      outputType: {
        // ['Object', 'ObjectArray', 'Text', 'TextArray', 'Markdown', 'Code']
        object: modifyQueryString('outputType', 'Object', 'array'),
        ObjectArray: modifyQueryString('outputType', 'ObjectArray', 'array'),
        Text: modifyQueryString('outputType', 'Text'),
        TextArray: modifyQueryString('outputType', 'TextArray', 'array'),
        Markdown: modifyQueryString('outputType', 'Markdown'),
        Code: modifyQueryString('outputType', 'Code'),
      },
      providers: generateFacet('provider', provider),
      authors: generateFacet('author', author),
    },
    models: modelsObject,
  }
})
