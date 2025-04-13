import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * Generate a basic OpenAPI schema and save it to the public directory
 * This is a simplified version that creates a static schema file
 * without requiring Payload initialization
 */
async function generateApiSchema() {
  try {
    console.log('Generating static OpenAPI schema...')
    
    const openApiSpec = {
      openapi: '3.0.0',
      info: {
        title: 'Drivly AI API',
        description: 'API for the Drivly AI Primitives Platform',
        version: '1.0.0',
        contact: {
          name: 'Drivly',
          url: 'https://drivly.com',
        },
      },
      servers: [
        {
          url: 'https://apis.do/api',
          description: 'Production API Server',
        },
      ],
      paths: {
        '/v1/ai': {
          get: {
            summary: 'List all AIs',
            description: 'Returns a list of all AIs',
            tags: ['AIs'],
            responses: {
              '200': {
                description: 'Successful response',
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: {
                        links: {
                          type: 'object',
                          properties: {
                            home: { type: 'string' },
                            next: { type: 'string' },
                            prev: { type: 'string' },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      components: {
        schemas: {
          AI: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              description: { type: 'string' },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' },
            },
          },
        },
      },
    }
    
    const publicDir = path.join(process.cwd(), 'public')
    try {
      await fs.access(publicDir)
    } catch (error) {
      await fs.mkdir(publicDir, { recursive: true })
    }
    
    const outputPath = path.join(publicDir, 'api.json')
    await fs.writeFile(outputPath, JSON.stringify(openApiSpec, null, 2))
    
    console.log(`✅ Generated static API schema at ${outputPath}`)
  } catch (error) {
    console.error('Error generating API schema:', error)
    process.exit(1)
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  generateApiSchema().catch(console.error)
}

export { generateApiSchema }
