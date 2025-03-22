import camelCase from 'camelcase'
import fs from 'node:fs'
import path from 'node:path'

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
    const modelsData = { models }

    // Write to models.json in src directory
    const outputPath = path.resolve('./src/models.json')
    fs.writeFileSync(outputPath, JSON.stringify(modelsData, null, 2))

    console.log(`Models data written to ${outputPath}`)
  } catch (error) {
    console.error('Error fetching or writing models data:', error)
    process.exit(1)
  }
}

main()
