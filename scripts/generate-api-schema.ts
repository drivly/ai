import fs from 'fs/promises'
import path from 'path'
import { generateOpenApiSpec } from '../lib/api-schema'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * Generate the OpenAPI schema and save it to the public directory
 */
async function generateApiSchema() {
  try {
    console.log('Generating OpenAPI schema...')
    
    const payloadInstance = {
      collections: {},
    }
    
    const spec = await generateOpenApiSpec(payloadInstance)
    
    const publicDir = path.join(process.cwd(), 'public')
    try {
      await fs.access(publicDir)
    } catch (error) {
      await fs.mkdir(publicDir, { recursive: true })
    }
    
    const outputPath = path.join(publicDir, 'api.json')
    await fs.writeFile(outputPath, JSON.stringify(spec, null, 2))
    
    console.log(`✅ Generated API schema at ${outputPath}`)
  } catch (error) {
    console.error('Error generating API schema:', error)
    process.exit(1)
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  generateApiSchema().catch(console.error)
}

export { generateApiSchema }
