import camelCase from 'camelcase'
import { aliases } from './aliases'
import { Model, Provider } from './types'
import rawModels from './models'

type InternalModel = Model

const allModels = rawModels as unknown as {
  models: Model[]
}

export type ParsedModelIdentifier = {
  provider?: string
  author?: string
  model?: string
  systemConfig?: Record<string, string | number>
  alias?: string
  priorities?: string[]
  providerConstraints?: {
    field: string
    value: string
    type: 'gt' | 'lt' | 'eq'
  }[]
  tools?: Record<string, string | number | boolean | Record<string, unknown>>
  capabilities?: Record<string, string | number | boolean>
  outputFormat?: string
  outputSchema?: string
  // Anything the parser doesnt know what to do with
  // Mostly used to pass tools, schemas, and other parameters to a higher level
  unasignedParameters?: Record<string, string | number | boolean>
}

// Priorities may be on its own, which indicates to just find the best value for that priority
// or it may be in one of the following formats:
// cost:<1 -> A model that has a cost of less than $1 per million tokens
// latency:<50 -> A model with a latency of less than 50ms
// throughput:>250 -> A model with a throughput higher than 250 tokens per second
// Additional notes: if just cost is specified, then it will be treated as outputCost
const priorities = ['cost', 'latency', 'throughput', 'inputCost', 'outputCost']
const capabilities = ['reasoning', 'thinking', 'tools', 'structuredOutput', 'responseFormat', 'pdf']
const defaultTools = ['exec', 'online']
const systemConfiguration = ['seed', 'thread', 'temperature', 'topP', 'topK']
// Any of the following is an output format, anything else that starts with a capital letter is an output *schema*
const outputFormats = ['Object', 'ObjectArray', 'Text', 'TextArray', 'Markdown', 'Code']

export function parse(modelIdentifier: string): ParsedModelIdentifier {
  const output: ParsedModelIdentifier = {
    model: '',
  }

  // Locate all paratheses, even nested ones
  const parentheses = modelIdentifier.match(/\(([^)]+)\)/g)

  output.model = modelIdentifier.split('(')[0]
  const modelName = output.model.includes('/') ? output.model.split('/')[1] : output.model

  if (aliases[modelName]) {
    output.model = aliases[modelName]
  }

  if (output.model.includes('/')) {
    const [author, model] = output.model.split('/')
    output.author = author
    output.model = model
  }

  if (output.model.includes('@')) {
    // @ indicates a specific provider
    const [model, provider] = output.model.split('@')
    output.model = model
    output.provider = provider
  }

  // If there are no parentheses, then we can just return the model identifier
  if (!parentheses) {
    return output
  }

  // Defaults storage allows us to set defaults for settings if they are missing from the input
  // The main use case is for output formats, where we want to set the format based on the schema
  // but only if the format isnt already set. Since we only have access to a single expression at once,
  // we need to store the defaults and apply them later.
  const defaultStorage: Record<string, string | number | boolean> = {}

  // Split by comma, each part is a new parameter that needs to be stored in the right
  // place in the output object
  // For each parathesis, we need to parse the contents
  for (const parenthesis of parentheses) {
    const contents = parenthesis.slice(1, -1)

    const parts = contents.split(',')

    for (const part of parts) {
      // Not all parts will have a colon, if not, treat it as a boolean with a value of true.
      const [key, value] = part
        // Cheat we can do to make the parsing easier
        .replace('<', ':<')
        .replace('>', ':>')
        .split(':')

      if (!key) {
        continue
      }

      let notAKnownParameter = false

      switch (true) {
        case defaultTools.includes(key):
          output.tools = output.tools || {}
          output.tools[key] = value || true
          break
        case systemConfiguration.includes(key):
          output.systemConfig = {
            ...output.systemConfig,
            [key]: value,
          }
          break
        case priorities.includes(key):
          if (value) {
            output.providerConstraints = output.providerConstraints || []
            output.providerConstraints.push({
              field: key,
              value: value.replace('>', '').replace('<', ''),
              type: value.startsWith('>') ? 'gt' : value.startsWith('<') ? 'lt' : 'eq',
            })
          } else {
            output.priorities = [...(output.priorities || []), key]
          }
          break
        case capabilities.includes(key):
          output.capabilities = {
            ...output.capabilities,
            [key]: value || true,
          }
          break
        case outputFormats.includes(key):
          output.outputFormat = key == 'Code' && !!value ? `Code:${value}` : key
          break
        default:
          notAKnownParameter = true
          break
      }

      if (!notAKnownParameter) {
        // No need to process any further
        continue
      }

      // If it starts with a capital letter, then it is a Schema
      if (key[0] === key[0].toUpperCase()) {
        const schema = key

        if (schema.includes('[]')) {
          defaultStorage.outputFormat = 'ObjectArray'
        } else {
          defaultStorage.outputFormat = 'Object'
        }

        output.outputSchema = schema.replace('[]', '')
      } else if (value?.includes('>') || value?.includes('<')) {
        // This is most likely a benchmark constraint
        output.providerConstraints = output.providerConstraints || []
        output.providerConstraints.push({
          field: key,
          value: value.replace('>', '').replace('<', ''),
          type: value.startsWith('>') ? 'gt' : 'lt',
        })
      } else {
        output.tools = output.tools || {}
        output.tools = {
          ...output.tools,
          [key]: value || true,
        }
      }
    }
  }

  // Custom rules / requirements
  // If someone has tools, they need to have the tools capability
  if (Object.values(output.tools || {}).length > 0) {
    if (!output.capabilities?.tools) {
      output.capabilities = {
        ...output.capabilities,
        tools: true,
      }
    }
  }

  // Finally, apply the defaults
  Object.entries(defaultStorage).forEach(([key, value]) => {
    const keyToCheck = key as keyof ParsedModelIdentifier
    if (output[keyToCheck] === undefined) {
      // @ts-expect-error - We know these assignments are safe based on our defaultStorage logic
      output[keyToCheck] = value
    }
  })

  return output
}

export function constructModelIdentifier(parsed: ParsedModelIdentifier): string {
  const modelAlias = aliases[parsed.model || ''] || parsed.model || ''
  let identifier = `${modelAlias}`

  if (parsed.provider) {
    identifier += `@${parsed.provider}`
  }

  const args: string[] = []

  const formatArgument = (key: string, value: string | number | boolean) => {
    // If the value is a boolean, then we can just return the key
    if (typeof value === 'boolean') {
      return value ? key : ''
    }

    console.log(key, value)

    // Otherwise, we need to format the value
    return `${key}:${value}`
  }

  const keysToFormat = ['capabilities', 'tools', 'systemConfig'] as const

  keysToFormat.forEach((key) => {
    if (parsed[key]) {
      Object.entries(parsed[key]).forEach(([key, value]) => {
        args.push(formatArgument(key, value as string | number | boolean))
      })
    }
  })

  if (parsed.priorities) {
    parsed.priorities.forEach((priority) => {
      args.push(priority)
    })
  }

  // Provider constraints are a bit more complex as they are stored as { field: string, value: string }[]
  if (parsed.providerConstraints) {
    parsed.providerConstraints.forEach((constraint) => {
      args.push(`${constraint.field}${constraint.type === 'gt' ? '>' : constraint.type === 'lt' ? '<' : ':'}${constraint.value}`)
    })
  }

  if (args.length) {
    identifier += `(${args.join(',')})`
  }

  return identifier
}

export function modelToIdentifier(model: Model): string {
  return constructModelIdentifier({
    model: model.slug.split('/')[1],
    provider: model.slug.split('/')[0],
  })
}

// Its a model, but with a provider attached
type ResolvedModel = Model & {
  provider: Provider
}

// A function that takes a model and a provider and returns a boolean
type FilterChainCallback = (model: InternalModel, provider: Provider) => boolean

export function filterModels(
  modelIdentifier: string,
  modelsToFilter?: InternalModel[],
): {
  models: ResolvedModel[]
  parsed: ParsedModelIdentifier
} {
  const parsed = parse(modelIdentifier)

  console.log(parsed)

  const modelAndProviders = []

  let modelsToFilterMixin = modelsToFilter

  if (metaModels.find((m) => m.name === parsed.model) && !modelsToFilter?.length) {
    const metaModelChildren = metaModels.find((m) => m.name === parsed.model)?.models
    modelsToFilterMixin = allModels.models.filter((m) => metaModelChildren?.includes(m.slug.split('/')[1])) as InternalModel[]

    // Because the parser has no model knowledge, it thinks the meta model name is the model name
    // Which will always return false.
    delete parsed.model
  } else if (modelsToFilter?.length) {
    modelsToFilterMixin = modelsToFilter as InternalModel[]
  } else {
    modelsToFilterMixin = allModels.models as InternalModel[]
  }

  const filterChain: FilterChainCallback[] = []

  if (parsed.model) {
    filterChain.push(function modelFilter(model) {
      // Wildcard search for any model that matches everything else.
      if (parsed.model == '*') {
        return true
      }

      return model.slug.split('/')[1].split(':')[0] === parsed.model.split(':')[0] && (parsed.model.includes('thinking') ? model.name.toLowerCase().includes('thinking') : true)
    })
  }

  // We're using named functions here so we can console.log the filter chain
  // and see what filter is being applied and when
  if (parsed.provider) {
    filterChain.push(function providerFilter(model, provider) {
      return provider?.slug === parsed.provider
    })
  }

  if (parsed?.providerConstraints?.length) {
    // Since the provider isnt defined, we need to filter based on the provider constraints
    filterChain.push(function providerConstraintFilter(model, provider) {
      return (
        parsed?.providerConstraints?.every((constraint) => {
          if (!provider) {
            return false
          }

          let fieldToCheck = constraint.field as keyof typeof provider

          if (constraint.field === 'cost') {
            fieldToCheck = 'outputCost'
          }

          switch (constraint.type) {
            case 'gt':
              return Number(provider[fieldToCheck]) > parseFloat(constraint.value)
            case 'lt':
              return Number(provider[fieldToCheck]) < parseFloat(constraint.value)
            case 'eq':
              return Number(provider[fieldToCheck]) === parseFloat(constraint.value)
            default:
              return false
          }
        }) || false
      )
    })
  }

  if (parsed.capabilities) {
    filterChain.push(function capabilitiesFilter(model, provider) {
      return Object.entries(parsed?.capabilities || {}).every(([key, value]) => {

        console.log(
          'Checking capability:',
          key,
          value,
          provider?.supportedParameters,
          provider?.supportedParameters?.includes(camelCase(key))
        )

        return provider?.supportedParameters?.includes(camelCase(key))
      })
    })
  }

  for (const model of modelsToFilterMixin as InternalModel[]) {
    for (const provider of model.providers || []) {
      if (filterChain.every((f) => f(model, provider))) {
        modelAndProviders.push({
          model,
          provider: provider,
        })
      }
    }
  }

  const orderBy = (fields: string[]) => (a: any, b: any) =>
    fields
      .map((o) => {
        let dir = 1
        if (o[0] === '-') {
          dir = -1
          o = o.substring(1)
        }

        // Support for dot notation to access nested properties
        const getNestedValue = (obj: any, path: string): any => {
          return path.split('.').reduce((prev, curr) => (prev && prev[curr] !== undefined ? prev[curr] : undefined), obj)
        }

        const aVal = getNestedValue(a, o)
        const bVal = getNestedValue(b, o)

        return aVal > bVal ? dir : aVal < bVal ? -dir : 0
      })
      .reduce((p: number, n: number) => (p ? p : n), 0)

  const reversedFields = ['throughput', 'cost']

  let sortingStrategy = orderBy(parsed?.priorities?.map((f) => `${reversedFields.includes(f) ? '-' : ''}provider.${f}`) || [])

  // Re-join back on model, replacing the providers with the filtered providers
  return {
    models: modelAndProviders
      .map((x) => ({
        ...x.model,
        provider: x.provider,
      }))
      .map((x) => {
        delete x.providers
        delete x.endpoint
        return x
      })
      .sort(sortingStrategy) as ResolvedModel[],
    parsed,
  }
}

/**
 * Helper function to get the first model that matches a model identifier
 * @param modelIdentifier
 * @returns ResolvedModel
 */
export function getModel(modelIdentifier: string, augments: Record<string, string | number | boolean | string[]> = {}) {
  // Inject the augments into the model string inside the parentheses
  // Keeping the content of the parentheses intact
  const parentheses = modelIdentifier.match(/\(([^)]+)\)/)

  const augmentsString: string[] = []

  Object.entries(augments).forEach(([key, value]) => {
    if (key == 'seed') augmentsString.push(`seed:${value}`)
    else if (key == 'temperature') augmentsString.push(`temperature:${value}`)
    else if (key == 'topP') augmentsString.push(`topP:${value}`)
    else if (key == 'topK') augmentsString.push(`topK:${value}`)
    else if (key == 'thread') augmentsString.push(`thread:${value}`)
    else if (key == 'requiredCapabilities') {
      for (const capability of value as string[]) {
        augmentsString.push(capability)
      }
    } else augmentsString.push(`${value}`)
  })

  console.log(
    'Model ID:',
    modelIdentifier
  )

  if (modelIdentifier.includes('thinking')) {
    augmentsString.push('reasoning')
  }

  if (parentheses) {
    modelIdentifier = modelIdentifier.replace(parentheses[0], `(${parentheses[1]},${augmentsString.filter(Boolean).join(',')})`)
  } else {
    if (augmentsString.length) {
      modelIdentifier += `(${augmentsString.join(',')})`
    }
  }

  const parsed = parse(modelIdentifier)

  const { models } = filterModels(modelIdentifier)

  const result = {
    ...models[0],
    parsed: {
      ...parsed,
      ...augments,
    },
  }

  // Only handle specific Claude models with thinking capability
  if (!result.slug) {
    // For claude models with thinking capability
    if (modelIdentifier.includes('claude-3.7-sonnet:thinking')) {
      result.slug = 'anthropic/claude-3.7-sonnet:thinking'
    }
  }

  return result
}

export function getModels(modelIdentifier: string) {
  // Split the modelIdentifier by comma, ignoring commas inside parentheses
  let result = []
  let segment = ''
  let depth = 0

  for (const char of modelIdentifier) {
    if (char === '(') depth++
    else if (char === ')') depth--
    else if (char === ',' && depth === 0) {
      result.push(segment.trim())
      segment = ''
      continue
    }
    segment += char
  }

  if (segment.trim()) result.push(segment.trim())

  // Resolve each segment
  return result.map((r) => getModel(r)) as (Model & { parsed: ParsedModelIdentifier })[]
}

// TODO: Move this to a database or another source of truth
// This isnt a good place for this data.
const metaModels = [
  {
    name: 'frontier',
    models: ['gemini-2.5-flash-preview', 'deepseek-r1', 'gpt-4.1', 'o4-mini-high'],
  },
  {
    name: 'frontierReasoning',
    models: ['claude-3.7-sonnet:reasoning', 'gemini-2.5-flash-preview:thinking', 'r1:reasoning', 'sonar-deep-research:reasoning'],
  },
  {
    name: 'cheapReasoning',
    models: ['qwq-32b:reasoning', 'deepseek-r1-distill-llama-70b:reasoning'],
  },
  {
    name: 'coding',
    models: ['claude-3.7-sonnet', 'o3-mini', 'deepseek-v3'],
  },
  {
    name: 'roleplay',
    models: ['mythomax-l2-13b', 'wizardlm-2-7b', 'claude-3.7-sonnet', 'ministral-8b'],
  },
  {
    name: 'cheapAndFast',
    models: ['gemini', 'gemma-3', 'gpt-4o-mini', 'ministral-8b'],
  },
  {
    name: 'wideRange',
    models: ['claude-3.7-sonnet', 'gemini', 'gpt-4o-mini', 'ministral-8b', 'qwq-32b'],
  },
]

console.log(
  getModel('google/gemini-2.5-flash-preview:thinking')
)