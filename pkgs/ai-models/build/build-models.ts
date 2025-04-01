import camelCase from 'camelcase'
import { flatten, unflatten } from 'flat'

const overwrites = {};

const sortingValues = [
  'top-weekly',
  'newest',
  'throughput-high-to-low',
  'latency-low-to-high',
  'pricing-low-to-high',
  'pricing-high-to-low'
]

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

async function main() {
  try {
    const URL = 'https://openrouter.ai/api/frontend/models/find?order=top-weekly'

    console.log('Fetching models data from OpenRouter...')

    const data = (await Promise.all(sortingValues.map(async (sortingValue) => {
      const URL = `https://openrouter.ai/api/frontend/models/find?order=${sortingValue}`
      console.log(`Fetching ${URL}...`)
      const response = await fetch(URL).then((res) => res.json()) as { data: any }
      return [
        sortingValue,
        camelCaseDeep(response.data)
      ]
    }))).reduce((acc, [sortingValue, models]) => {
      acc[sortingValue] = models
      return acc
    }, {} as Record<string, any>)

    const models = data['top-weekly']

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

      const modelIndexes = sortingValues.map((sortingValue) => {
        const models = data[sortingValue]
        const index = models.models.findIndex((m) => m.slug === model.slug)
        return {
          [camelCase(sortingValue)]: index
        }
      }).reduce((acc, curr) => {
        return { ...acc, ...curr }
      }, {})

      const mergedModel = { ...model, sorting: modelIndexes }

      return mergedModel
    })

    // Write to models.json in src directory
    const { resolve } = await import('node:path')
    const { writeFileSync } = await import('node:fs')
    
    const outputPath = resolve('./src/models.ts')
    writeFileSync(outputPath, `export default ${JSON.stringify({ models: modelsData }, null, 2)}`)

    console.log(`Models data written to ${outputPath}`)
  } catch (error) {
    console.error('Error fetching or writing models data:', error)
    process.exit(1)
  }
}

main()