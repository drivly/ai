import camelCase from 'camelcase'
import { flatten, unflatten } from 'flat'

const overwrites = {}

const sortingValues = ['top-weekly', 'newest', 'throughput-high-to-low', 'latency-low-to-high', 'pricing-low-to-high', 'pricing-high-to-low']

function camelCaseDeep<T>(input: T): T {
  if (Array.isArray(input)) {
    return input.map(camelCaseDeep) as any
  }

  if (input !== null && typeof input === 'object') {
    return Object.entries(input).reduce(
      (acc, [key, value]) => {
        acc[camelCase(key)] = camelCaseDeep(value)
        return acc
      },
      {} as Record<string, any>,
    ) as any
  }

  return input
}

async function fetchProviders(slug: string, isThinkingModel: boolean = false) {
  const url = `https://openrouter.ai/api/frontend/stats/endpoint?permaslug=${slug}${ isThinkingModel ? '&variant=thinking' : '' }`

  const response = (await fetch(url).then((res) => res.json())) as { data: any }

  return camelCaseDeep(response.data || [])
}

const authorIconCache = new Map<string, string>()

async function getModelAuthorIcon(model: string): Promise<string> {
  const [author, modelName] = model.split('/')
  if (authorIconCache.has(author)) {
    console.log('[ICONS] Used cache for author:', author)

    return authorIconCache.get(author) as string
  }

  const html = await fetch(`https://openrouter.ai/${author}`).then((res) => res.text())

  // 'https://t0.gstatic.com/faviconV2',
  // '/images/icons/'

  const patterns = [
    {
      pattern: '/images/icons/',
      getUrl: (icon: string) => {
        return 'https://openrouter.ai/images/icons/' + icon
      },
    },
    {
      pattern: 'https://t0.gstatic.com/faviconV2',
      getUrl: (icon: string) => {
        // @ts-expect-error - replaceAll exists, no clue why TS is complaining
        return 'https://t0.gstatic.com/faviconV2' + icon.replaceAll('\u0026', '&')
      },
    },
  ]

  const activePattern = patterns.find((p) => html.includes(p.pattern))

  if (!activePattern) {
    console.log('[ICONS] Falling back as we cant find a icon for', model)

    return ''
  }

  const icon = html.split(activePattern.pattern)[1].split('\\"')[0]

  const url = activePattern.getUrl(icon)

  authorIconCache.set(author, url)

  return url
}

async function main() {
  try {
    const URL = 'https://openrouter.ai/api/frontend/models/find?order=top-weekly'

    console.log('Fetching models data from OpenRouter...')

    const data = (
      await Promise.all(
        sortingValues.map(async (sortingValue) => {
          const URL = `https://openrouter.ai/api/frontend/models/find?order=${sortingValue}`
          console.log(`Fetching ${URL}...`)
          const response = (await fetch(URL).then((res) => res.json())) as { data: any }
          return [sortingValue, camelCaseDeep(response.data)]
        }),
      )
    ).reduce(
      (acc, [sortingValue, models]) => {
        acc[sortingValue] = models
        return acc
      },
      {} as Record<string, any>,
    )

    const models = data['top-weekly']

    const allProviders = await fetch('https://openrouter.ai/api/frontend/all-providers')
      .then((res) => res.json())
      .then((data) => data.data)

    const modelsData = models.models.map((model) => {
      if (model.slug in overwrites) {
        console.log(`Overwriting model ${model.slug} with custom data`, overwrites[model.slug])
        const tempModel: Record<string, unknown> = flatten(model)
        const tempOverwrites: Record<string, unknown> = flatten(overwrites[model.slug])
        const mergedModel = { ...tempModel, ...tempOverwrites }
        return unflatten(mergedModel)
      }

      // Find the model in the other sorting values
      // Then add a sorting object that has the index of the model in the other sorting values

      const modelIndexes = sortingValues
        .map((sortingValue) => {
          const models = data[sortingValue]
          const index = models.models.findIndex((m) => m.slug === model.slug)
          return {
            [camelCase(sortingValue)]: index,
          }
        })
        .reduce((acc, curr) => {
          return { ...acc, ...curr }
        }, {})

      const mergedModel = { ...model, sorting: modelIndexes }

      return mergedModel
    })

    const finalModels = []

    const providerAliases = {
      'Google AI Studio': 'google',
      'Google Vertex': 'vertex',
    }

    let completed = 0

    for (const model of modelsData) {
      console.log(`[ICONS] Fetching author icon for ${model.slug}...`)

      model.authorIcon = await getModelAuthorIcon(model.slug)

      console.log('[ICONS] Found author icon', model.authorIcon)

      console.log(`[PROVIDERS] Fetching provider metadata for ${model.permaslug}...`)

      const isThinkingModel = model.name.toLowerCase().includes('thinking')

      const providers = await fetchProviders(model.permaslug, isThinkingModel)
      model.providers = providers.map((provider) => {
        const providerName = providerAliases[provider.providerDisplayName] || provider.providerDisplayName

        const priceToDollars = (price: string) => {
          // To get the dollar price, we need to multiply the price by a million.
          const priceNumber = parseFloat(price)
          return Number(
            (priceNumber * 1000000)
              .toFixed(2)
              // Remove trailing zeros
              .replace(/\.?0+$/, ''),
          )
        }

        let icon = allProviders.find((p) => p.displayName === provider.providerDisplayName)?.icon?.url || ''

        if (icon.includes('/images/icons/')) {
          icon = `https://openrouter.ai${icon}`
        }

        const params = !model.name.toLowerCase().includes('thinking') ? provider.supportedParameters.filter(p => !p.includes('reason')) : provider.supportedParameters

        // Fix OR not adding reasoning as a supported parameter
        // for reasoning providers.
        if (isThinkingModel) {
          params.push('reasoning')
        }

        return {
          name: provider.providerName,
          icon,
          slug: camelCase(providerName),
          quantization: provider.quantization,
          context: provider.contextLength,
          maxCompletionTokens: provider.maxCompletionTokens,
          providerModelId: provider.providerModelId,
          pricing: provider.pricing,
          // Disable claude's reasoning parameter as it's only supported via the :thinking tag.
          supportedParameters: params,
          inputCost: priceToDollars(provider.pricing.prompt),
          outputCost: priceToDollars(provider.pricing.completion),
          throughput: provider.stats?.p50Throughput,
          latency: provider.stats?.p50Latency,
        }
      })

      if (model.name.toLowerCase().includes('thinking')) {
        model.slug = model.slug + ':thinking'
      }

      completed++
      console.log(`[PROVIDERS] ${completed}/${modelsData.length} models completed`)
    }

    // Write to models.json in src directory
    const { resolve } = await import('node:path')
    const { writeFileSync, readFileSync, existsSync } = await import('node:fs')

    const outputPath = resolve('./src/models.js')

    writeFileSync(outputPath, `export default ${JSON.stringify({ models: modelsData }, null, 2)}`)

    if (existsSync(outputPath)) {
      // Read the file first, we want to get a list of models that were added in this run.
      const existingModels = JSON.parse(readFileSync(outputPath, 'utf8').replace('export default ', ''))
      const newModels = modelsData.filter((model) => !existingModels.models.some((m) => m.permaslug === model.permaslug))
      const removedModels = existingModels.models.filter((model) => !modelsData.some((m) => m.permaslug === model.permaslug))

      const saveRead = (path: string): string => {
        try {
          return readFileSync(path, 'utf8')
        } catch (error) {
          return ''
        }
      }

      const logPath = resolve('./changelog.md')
      const currentLogMarkdown = saveRead(logPath)

      if (newModels.length || removedModels.length) {
        const addedModelsSegment =
          newModels.length > 0
            ? `### Added models:
          ${newModels.map((m) => `- ${m.slug}`).join('\n')}`
            : ''

        const removedModelsSegment =
          removedModels.length > 0
            ? `### Removed models:
          ${removedModels.map((m) => `- ${m.slug}`).join('\n')}`
            : ''

        writeFileSync(
          logPath,
          // Append the new models to the file.
          // Title should be the date and hour of the run.
          `# ${new Date().toISOString().split('T')[0]} ${new Date().toISOString().split('T')[1].split('.')[0]}
          ${addedModelsSegment}
          ${removedModelsSegment}
          
          ${currentLogMarkdown}`
            // @ts-expect-error - replaceAll exists, no clue why TS is complaining
            .replaceAll('  ', ''),
        )
      }
    }

    console.log(`Models data written to ${outputPath}`)
  } catch (error) {
    console.error('Error fetching or writing models data:', error)
    process.exit(1)
  }
}

main()
