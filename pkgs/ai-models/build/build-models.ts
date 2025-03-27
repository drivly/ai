import camelCase from 'camelcase'
import fs from 'node:fs'
import path from 'node:path'
import { overwrites } from './overwrites'
import { flatten, unflatten } from 'flat'

const URL = 'https://openrouter.ai/api/frontend/models/find?order=top-weekly'

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
    console.log('Fetching models data from OpenRouter...')
    const response = await fetch(URL).then((res) => res.json())

    const models = camelCaseDeep(response.data)
    const modelsData = models.models.map((model) => {
      if (model.slug in overwrites) {
        console.log(`Overwriting model ${model.slug} with custom data`, overwrites[model.slug])
        const tempModel: Record<string, unknown> = flatten(model)
        const tempOverwrites: Record<string, unknown> = flatten(overwrites[model.slug])
        const mergedModel = { ...tempModel, ...tempOverwrites }
        return unflatten(mergedModel)
      }

      return model
    })

    // Write to models.json in src directory
    const outputPath = path.resolve('./src/models.ts')
    fs.writeFileSync(outputPath, `export default ${JSON.stringify({ models: modelsData }, null, 2)}`)

    console.log(`Models data written to ${outputPath}`)
  } catch (error) {
    console.error('Error fetching or writing models data:', error)
    process.exit(1)
  }
}

main()
